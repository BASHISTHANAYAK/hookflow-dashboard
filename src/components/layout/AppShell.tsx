import React from "react";
import { Navbar } from "./Navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} HookFlow. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-muted-foreground/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Secured by Razorpay • 256-bit SSL encryption
          </span>
        </div>
      </footer>
    </div>
  );
};
