import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Clients from "./pages/Clients";
import Gallery from "./pages/Gallery";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route element={<AppLayout><Dashboard /></AppLayout>} path="/" />
            <Route element={<AppLayout><Bookings /></AppLayout>} path="/bookings" />
            <Route element={<AppLayout><Clients /></AppLayout>} path="/clients" />
            <Route element={<AppLayout><Gallery /></AppLayout>} path="/gallery" />
            <Route element={<AppLayout><Notifications /></AppLayout>} path="/notifications" />
            <Route element={<AppLayout><Settings /></AppLayout>} path="/settings" />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
