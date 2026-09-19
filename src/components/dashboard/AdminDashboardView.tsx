import React, { useState } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { useAdminStats } from "../../hooks/useAdminStats";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { StatsCards } from "../admin/StatsCards";
import { UsersTable } from "../admin/UsersTable";
import { SimulateFailurePanel } from "../admin/SimulateFailurePanel";
import { Button } from "../ui/button";
import { AdminTab } from "../layout/Sidebar";

interface AdminDashboardViewProps {
  activeTab?: AdminTab;
  onSelectTab?: (tab: AdminTab) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  activeTab = "overview",
  onSelectTab,
}) => {
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Fetch admin stats & users
  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useAdminStats(dateFilter.startDate, dateFilter.endDate);

  const {
    users,
    pagination,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
    isRefetching: isUsersRefetching,
    simulateFailure,
    isSimulating,
  } = useAdminUsers(page, 10);

  const handleRefreshAll = () => {
    if (activeTab === "overview") {
      refetchStats();
    } else if (activeTab === "users") {
      refetchUsers();
    } else {
      refetchStats();
      refetchUsers();
    }
  };

  const isRefreshing = isStatsRefetching || isUsersRefetching;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {activeTab === "overview" && "Analytics Overview"}
              {activeTab === "users" && "User Subscriptions"}
              {activeTab === "sandbox" && "Developer Sandbox"}
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              ADMIN
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === "overview" && "Monitor monthly recurring revenue, subscriber counts, and payment health."}
            {activeTab === "users" && "Search, view, and inspect all customer subscription states and billing records."}
            {activeTab === "sandbox" && "Simulate payment failures to test automated webhook queues and alert workflows."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Mobile Tab Selector (Visible on small screens where sidebar is hidden) */}
          <div className="flex md:hidden items-center rounded-lg border border-border bg-card p-1 text-xs">
            <button
              onClick={() => onSelectTab?.("overview")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "overview" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onSelectTab?.("users")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "users" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => onSelectTab?.("sandbox")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "sandbox" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              Sandbox
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            isLoading={isRefreshing}
            className="gap-1.5 text-xs shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab 1: Analytics Overview */}
      {activeTab === "overview" && (
        <section aria-labelledby="stats-heading" className="space-y-4 animate-in fade-in-50 duration-200">
          <StatsCards
            stats={stats}
            isLoading={isStatsLoading}
            onFilterChange={(startDate, endDate) =>
              setDateFilter({ startDate, endDate })
            }
          />
        </section>
      )}

      {/* Tab 2: User Subscriptions Table */}
      {activeTab === "users" && (
        <section aria-labelledby="users-heading" className="space-y-4 animate-in fade-in-50 duration-200">
          <UsersTable
            users={users}
            pagination={pagination}
            isLoading={isUsersLoading}
            onPageChange={(newPage) => setPage(newPage)}
            onSelectUserForSimulation={(userId) => {
              setSelectedUserId(userId);
              onSelectTab?.("sandbox");
            }}
          />
        </section>
      )}

      {/* Tab 3: Dev Tools Payment Failure Simulation */}
      {activeTab === "sandbox" && (
        <section aria-labelledby="devtools-heading" className="space-y-4 animate-in fade-in-50 duration-200 max-w-3xl">
          <SimulateFailurePanel
            selectedUserId={selectedUserId}
            onSimulate={simulateFailure}
            isSimulating={isSimulating}
          />
        </section>
      )}
    </div>
  );
};
