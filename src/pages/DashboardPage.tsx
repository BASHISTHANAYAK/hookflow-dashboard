import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { AppShell } from "../components/layout/AppShell";
import { AdminShell } from "../components/layout/AdminShell";
import { CustomerDashboardView } from "../components/dashboard/CustomerDashboardView";
import { AdminDashboardView } from "../components/dashboard/AdminDashboardView";
import { AdminTab } from "../components/layout/Sidebar";

export const DashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuthStore();
  const isUserAdmin = isAdmin || user?.role === "ADMIN";
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("overview");

  if (isUserAdmin) {
    return (
      <AdminShell activeTab={activeAdminTab} onSelectTab={setActiveAdminTab}>
        <AdminDashboardView
          activeTab={activeAdminTab}
          onSelectTab={setActiveAdminTab}
        />
      </AdminShell>
    );
  }

  return (
    <AppShell>
      <CustomerDashboardView />
    </AppShell>
  );
};
