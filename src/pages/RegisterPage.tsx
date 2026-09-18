import React from "react";
import { Webhook } from "lucide-react";
import { RegisterForm } from "../components/auth/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Webhook className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create HookFlow Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your customer account to start managing webhooks
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/80 shadow-xl shadow-black/5 bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Customer Registration</CardTitle>
            <CardDescription className="text-xs">
              Provide your details and WhatsApp number for automated webhook delivery alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        {/* Footnote */}
        <div className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service & Privacy Policy.
        </div>
      </div>
    </div>
  );
};
