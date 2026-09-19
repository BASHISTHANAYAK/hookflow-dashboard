import React, { useState } from "react";
import { AdminShell } from "../components/layout/AdminShell";
import { AdminDashboardView } from "../components/dashboard/AdminDashboardView";
import { AdminTab } from "../components/layout/Sidebar";

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  return (
    <AdminShell activeTab={activeTab} onSelectTab={setActiveTab}>
      <AdminDashboardView activeTab={activeTab} onSelectTab={setActiveTab} />
    </AdminShell>
  );
};
