import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    const role = formData.email.includes("admin") ? "admin" : "client";
    login(formData.email, formData.password);
    // Redirect based on role
    if (role === "admin") {
      navigate("/");
    } else {
      navigate("/client-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light flex items-center justify-center px-4 py-8">
      <Card className="glass w-full max-w-md rounded-[2rem] border border-white/70 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome Back</CardTitle>
          <CardDescription className="text-base text-slate-500">
            Sign in to your Bloom Studio account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 rounded-2xl border-slate-200 bg-white/85 pl-10 text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 rounded-2xl border-slate-200 bg-white/85 pl-10 pr-10 text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-0.5 hover:opacity-95"
            >
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
