import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Terminal,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggle,
}) => {
  const location = useLocation();

  const navItems = [
    {
      label: "Admin Overview",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Metrics & revenue",
    },
    {
      label: "User Subscriptions",
      href: "/admin#users",
      icon: Users,
      description: "Manage accounts",
    },
    {
      label: "Dev Tools / Sandbox",
      href: "/admin#dev-tools",
      icon: Terminal,
      description: "Simulate webhooks",
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-md transition-all duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/80">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
            <span className="font-semibold text-sm tracking-tight">Admin Console</span>
          </div>
        )}
        {collapsed && (
          <ShieldCheck className="h-6 w-6 text-indigo-500 mx-auto" />
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 text-muted-foreground ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Nav links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || (item.href.startsWith("/admin#") && location.hash === item.href.slice(6));
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    {item.description}
                  </span>
                </div>
              )}
            </a>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/80">
        <Link to="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className={`w-full gap-2 text-xs ${
              collapsed ? "px-0 justify-center" : "justify-start"
            }`}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Customer Portal</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
};
