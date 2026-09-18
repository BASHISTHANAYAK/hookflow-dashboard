import React from "react";
import { Link } from "react-router-dom";
import { Webhook, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
        <Webhook className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        404
      </h1>
      <h2 className="mt-2 text-xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved to another URL.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
