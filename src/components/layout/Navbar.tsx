import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Webhook,
  LogOut,
  Shield,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
              <Webhook className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                HookFlow
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  SaaS
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                My Subscription
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive("/admin")
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Shield className="h-4 w-4 text-indigo-500" />
                  Admin Console
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* User Info & Actions */}
        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-border/80 pr-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                {user.email.slice(0, 2)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground truncate max-w-[160px]">
                  {user.email}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    {user.role}
                  </Badge>
                  {user.phoneNumber && (
                    <span className="text-[10px] text-muted-foreground">
                      {user.phoneNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>
        )}

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {user ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                  {user.email.slice(0, 2)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {user.email}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                    {user.phoneNumber && (
                      <span className="text-xs text-muted-foreground">
                        {user.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive("/dashboard") ? "bg-secondary font-semibold" : ""
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  My Subscription
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive("/admin") ? "bg-secondary font-semibold" : ""
                    }`}
                  >
                    <Shield className="h-4 w-4 text-indigo-500" />
                    Admin Console
                  </Link>
                )}
              </div>

              <Button
                variant="destructive"
                className="w-full justify-center gap-2 mt-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
              >
                Sign In
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/register");
                }}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
