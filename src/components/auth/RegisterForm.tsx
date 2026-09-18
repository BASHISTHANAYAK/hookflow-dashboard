import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { registerApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    phoneNumber?: string;
  }>({});

  const validate = () => {
    const errs: { email?: string; password?: string; phoneNumber?: string } = {};

    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneNumber) {
      errs.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(phoneNumber.trim())) {
      errs.phoneNumber = "Must follow format: +91 followed by 10 digits (e.g. +919876543210)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    try {
      // 1. Register customer account and receive token directly
      const registerRes = await registerApi({
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
      });

      if (!registerRes.token || !registerRes.user) {
        throw new Error(registerRes.message || "Registration succeeded but session token was missing.");
      }

      // 2. Immediately store token and user in Zustand & localStorage
      setAuth(registerRes.user, registerRes.token);

      toast.success("Account created successfully!", {
        description: `Welcome to HookFlow, ${registerRes.user.email}!`,
      });

      // 3. Direct auto-login redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      toast.error("Registration error", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className="pl-9"
            disabled={isLoading}
            error={errors.email}
            required
          />
        </div>
      </div>

      {/* Phone Number with E.164 +91 validation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="phone">WhatsApp Phone (+91)</Label>
          <span className="text-[11px] text-muted-foreground">E.164 Format</span>
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+919876543210"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (errors.phoneNumber)
                setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
            }}
            className="pl-9 font-mono"
            disabled={isLoading}
            error={errors.phoneNumber}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="SecurePass123"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className="pl-9"
            disabled={isLoading}
            error={errors.password}
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
        Create Account & Go to Dashboard
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <div className="pt-2 text-center text-xs text-muted-foreground">
        Already registered?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:underline hover:text-primary/90"
        >
          Sign in to your account
        </Link>
      </div>
    </form>
  );
};
