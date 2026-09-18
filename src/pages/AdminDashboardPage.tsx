import React, { useState } from "react";
import { ShieldCheck, RefreshCw, Users, BarChart3, Terminal } from "lucide-react";
import { useAdminStats } from "../hooks/useAdminStats";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { AdminShell } from "../components/layout/AdminShell";
import { StatsCards } from "../components/admin/StatsCards";
import { UsersTable } from "../components/admin/UsersTable";
import { SimulateFailurePanel } from "../components/admin/SimulateFailurePanel";
import { Button } from "../components/ui/button";

export const AdminDashboardPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [selectedUserId, setSelectedUserId] = useState<string>("");

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
    refetchStats();
    refetchUsers();
  };

  const isRefreshing = isStatsRefetching || isUsersRefetching;

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in-50 duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Admin Console
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                ADMIN
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor monthly recurring revenue, active subscriptions, and customer payment states.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              isLoading={isRefreshing}
              className="gap-1.5 text-xs shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Section 1: Revenue & Metrics Overview */}
        <section aria-labelledby="stats-heading" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 id="stats-heading">Billing Analytics</h2>
          </div>
          <StatsCards
            stats={stats}
            isLoading={isStatsLoading}
            onFilterChange={(startDate, endDate) =>
              setDateFilter({ startDate, endDate })
            }
          />
        </section>

        {/* Section 2: User Subscriptions Table */}
        <section id="users" aria-labelledby="users-heading" className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users className="h-4 w-4 text-primary" />
            <h2 id="users-heading">User Subscriptions & Payment Records</h2>
          </div>
          <UsersTable
            users={users}
            pagination={pagination}
            isLoading={isUsersLoading}
            onPageChange={(newPage) => setPage(newPage)}
            onSelectUserForSimulation={(userId) => {
              setSelectedUserId(userId);
              const devToolsEl = document.getElementById("dev-tools");
              if (devToolsEl) {
                devToolsEl.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />
        </section>

        {/* Section 3: Dev Tools Payment Failure Simulation */}
        <section aria-labelledby="devtools-heading" className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Terminal className="h-4 w-4 text-amber-500" />
            <h2 id="devtools-heading">Developer Testing Sandbox</h2>
          </div>
          <SimulateFailurePanel
            selectedUserId={selectedUserId}
            onSimulate={simulateFailure}
            isSimulating={isSimulating}
          />
        </section>
      </div>
    </AdminShell>
  );
};
