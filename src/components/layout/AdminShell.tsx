import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar, AdminTab } from "./Sidebar";

interface AdminShellProps {
  children?: React.ReactNode;
  activeTab?: AdminTab;
  onSelectTab?: (tab: AdminTab) => void;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  activeTab = "overview",
  onSelectTab,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [internalTab, setInternalTab] = useState<AdminTab>(activeTab);

  const currentTab = onSelectTab ? activeTab : internalTab;
  const handleSelectTab = onSelectTab || setInternalTab;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          activeTab={currentTab}
          onSelectTab={handleSelectTab}
        />
        <main className="flex-1 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
