import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { role: string } | null;
  login: (email: string, password: string, role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ role: string } | null>(null);

  const login = (email: string, password: string, role?: string) => {
    // Mock login - in real app, call API
    // role override from selected role in signup, otherwise infer from email
    const finalRole = role ?? (email.includes("admin") ? "admin" : "client");
    setUser({ role: finalRole });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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