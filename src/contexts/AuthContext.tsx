import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { auth, rtdb } from "@/firebase/config";

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string>;
  signup: (email: string, password: string, role: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getRoleCacheKey = (uid: string) => `bloom-user-role:${uid}`;

const cacheUserRole = (uid: string, role: string) => {
  localStorage.setItem(getRoleCacheKey(uid), role);
};

const getCachedUserRole = (uid: string) => localStorage.getItem(getRoleCacheKey(uid));

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, fallbackValue: T) => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutHandle = setTimeout(() => resolve(fallbackValue), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
};

const mapAuthError = (error: unknown, fallback: string) => {
  if (!(error instanceof FirebaseError)) {
    return fallback;
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "unavailable":
      return "Firebase is currently unavailable. Check your connection and Realtime Database rules.";
    default:
      return error.message || fallback;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveUserRole = async (firebaseUser: User) => {
    const cachedRole = getCachedUserRole(firebaseUser.uid);

    try {
      const userDoc = await withTimeout(
        get(ref(rtdb, `users/${firebaseUser.uid}`)),
        4000,
        null,
      );

      if (!userDoc) {
        return cachedRole || "client";
      }

      if (userDoc.exists()) {
        const role = (userDoc.val()?.role as string) || "client";
        cacheUserRole(firebaseUser.uid, role);
        return role;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }

    return cachedRole || "client";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const cachedRole = getCachedUserRole(firebaseUser.uid);
        setUserRole(cachedRole || "client");
        setLoading(false);

        void resolveUserRole(firebaseUser).then((role) => {
          setUserRole(role);
        });
      } else {
        setUser(null);
        setUserRole(null);
        setLoading(false);
      }
    }, (error) => {
      console.error("Auth state error:", error);
      setUser(null);
      setUserRole(null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = await resolveUserRole(userCredential.user);
      setUserRole(role);
      return role;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(mapAuthError(error, "Login failed. Please try again."));
    }
  };

  const signup = async (email: string, password: string, role: string, name?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name if provided
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      cacheUserRole(userCredential.user.uid, role);

      try {
        await set(ref(rtdb, `users/${userCredential.user.uid}`), {
          email,
          role,
          name: name || "",
          createdAt: new Date().toISOString(),
        });
      } catch (databaseError) {
        console.error("Error saving user profile:", databaseError);
      }

      setUserRole(role);
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error(mapAuthError(error, "Signup failed. Please try again."));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
