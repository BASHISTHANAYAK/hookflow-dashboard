import React from "react";
import {
  LayoutDashboard,
  Users,
  Terminal,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";

export type AdminTab = "overview" | "users" | "sandbox";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggle,
  activeTab,
  onSelectTab,
}) => {
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[] = [
    {
      id: "overview",
      label: "Admin Overview",
      icon: LayoutDashboard,
      description: "Metrics & revenue",
    },
    {
      id: "users",
      label: "User Subscriptions",
      icon: Users,
      description: "Manage accounts",
    },
    {
      id: "sandbox",
      label: "Dev Sandbox",
      icon: Terminal,
      description: "Simulate failures",
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

      {/* Interactive Tabs */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold shadow-sm"
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
            </button>
          );
        })}
      </div>

      {/* Clean footer */}
      <div className="p-4 border-t border-border/80 text-xs text-muted-foreground">
        {!collapsed ? (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Admin Workspace</span>
          </div>
        ) : (
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 mx-auto"></span>
        )}
      </div>
    </aside>
  );
};
