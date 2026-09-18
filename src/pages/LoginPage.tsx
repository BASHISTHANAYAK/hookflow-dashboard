import React from "react";
import { Webhook, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { LoginForm } from "../components/auth/LoginForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Webhook className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to HookFlow
          </h1>
          <p className="text-sm text-muted-foreground">
            Webhook subscription management & automated recovery
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/80 shadow-xl shadow-black/5 bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Welcome back</CardTitle>
            <CardDescription className="text-xs">
              Enter your credentials to access your billing and subscription portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Quick Highlights */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure JWT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Razorpay Billing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5 text-indigo-500" />
            <span>Auto Recovery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
