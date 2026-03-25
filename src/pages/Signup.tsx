import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.role, formData.name);
      // Redirect based on role
      if (formData.role === "admin") {
        navigate("/");
      } else {
        navigate("/client-dashboard");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      alert(`Signup failed: ${message}`);
    }
  };

  return (
    <div className="auth-scene flex min-h-screen items-center justify-center px-4 py-8">
      <div className="relative z-10 w-full max-w-md">
      <Card className="w-full rounded-[2rem] border border-violet-300/35 bg-violet-950/20 shadow-[0_24px_80px_-24px_rgba(7,2,28,0.8)] backdrop-blur-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Create Account</CardTitle>
          <CardDescription className="text-base text-violet-100/70">
            Join Bloom Studio CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-violet-50">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-4 h-4 w-4 text-grey-100/65" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 rounded-full border border-violet-200/20 bg-white/12 pl-10 text-grey placeholder:text-grey-100/45 focus-visible:ring-2 focus-visible:ring-violet-300/45 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>
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
                  className="absolute right-3 top-4 text-violet-100/65 transition-colors hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-violet-50">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="h-12 w-full rounded-full border border-violet-200/20 bg-white/12 text-white focus:ring-violet-300/45 focus:ring-offset-0">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="border-violet-200/20 bg-violet-950/95 text-white">
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-violet-50">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 h-4 w-4 text-grey-100/65" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-12 rounded-full border border-violet-200/20 bg-white/12 pl-10 pr-10 text-grey placeholder:text-grey-100/45 focus-visible:ring-2 focus-visible:ring-violet-300/45 focus-visible:ring-offset-0"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-4 text-grey-100/65 transition-colors hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-white text-violet-900 shadow-lg shadow-black/25 transition-transform hover:-translate-y-0.5 hover:bg-violet-50"
            >
              Sign Up
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-violet-100/75">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-white hover:text-violet-100 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Signup;
