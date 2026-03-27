import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Clients from "./pages/Clients";
import Gallery from "./pages/Gallery";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Storage from "./pages/Storage";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import ProjectDetails from "./pages/ProjectDetails";
import { ProtectedRoute, PublicRoute } from "@/components/RouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route
                path="/client-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["client"]}>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><Dashboard /></AppLayout>
                  </ProtectedRoute>
                }
                path="/"
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><Bookings /></AppLayout>
                  </ProtectedRoute>
                }
                path="/bookings"
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><Clients /></AppLayout>
                  </ProtectedRoute>
                }
                path="/clients"
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><Gallery /></AppLayout>
                  </ProtectedRoute>
                }
                path="/gallery"
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><Notifications /></AppLayout>
                  </ProtectedRoute>
                }
                path="/notifications"
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><Storage /></AppLayout>
                  </ProtectedRoute>
                }
                path="/storage"
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><Settings /></AppLayout>
                  </ProtectedRoute>
                }
                path="/settings"
              />
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppLayout><ProjectDetails /></AppLayout>
                  </ProtectedRoute>
                }
                path="/projects/:projectId"
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
