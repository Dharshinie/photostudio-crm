import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const role = await login(formData.email, formData.password);
      navigate(role === "admin" ? "/" : "/client-dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      alert(`Login failed: ${message}`);
    }
  };

  return (
    <div className="auth-scene flex min-h-screen items-center justify-center px-4 py-8">
      <div className="relative z-10 w-full max-w-md">
      <Card className="w-full rounded-[2rem] border border-violet-300/35 bg-violet-950/20 shadow-[0_24px_80px_-24px_rgba(7,2,28,0.8)] backdrop-blur-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</CardTitle>
          <CardDescription className="text-base text-violet-100/70">
            Sign in to your Bloom Studio account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-violet-50">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-4 h-4 w-4 text-grey-100/65" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 rounded-full border border-violet-200/20 bg-white/12 pl-10 text-grey placeholder:text-grey-100/45 focus-visible:ring-2 focus-visible:ring-violet-300/45 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-violet-50">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 h-4 w-4 text-grey-100/65" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 rounded-full border border-violet-200/20 bg-white/12 pl-10 pr-10 text-grey placeholder:text-grey-100/45 focus-visible:ring-2 focus-visible:ring-violet-300/45 focus-visible:ring-offset-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-grey-100/65 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-white text-violet-900 shadow-lg shadow-black/25 transition-transform hover:-translate-y-0.5 hover:bg-violet-50"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-violet-100/75">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-white hover:text-violet-100 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Login;
