import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { loginApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showColdStartWarning, setShowColdStartWarning] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowColdStartWarning(true);
      }, 3000);
    } else {
      setShowColdStartWarning(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    try {
      const data = await loginApi({ email, password });
      const user = data.getUser || data.user;
      const token = data.token;

      if (!token || !user) {
        throw new Error(data.message || "Failed to authenticate");
      }

      setAuth(user, token);
      toast.success("Welcome back!", {
        description: `Signed in as ${user.email}`,
      });

      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Unable to sign in. Please verify your credentials.";
      toast.error("Sign in failed", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="alex@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className="pl-9"
            disabled={isLoading}
            error={errors.email}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className="pl-9"
            disabled={isLoading}
            error={errors.password}
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-2 font-medium"
        size="lg"
        isLoading={isLoading}
      >
        Sign In
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {showColdStartWarning && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-in fade-in duration-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0" />
          <span>Waking up server (Free Tier). This may take up to 50 seconds...</span>
        </div>
      )}

      <div className="pt-2 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:underline hover:text-primary/90"
        >
          Create one now
        </Link>
      </div>
    </form>
  );
};
