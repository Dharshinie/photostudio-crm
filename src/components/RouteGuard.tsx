import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const getDashboardPath = (role: string | null) => (role === "client" ? "/client-dashboard" : "/");

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      Loading...
    </div>
  );
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return children;
}

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (user) {
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return children;
}
