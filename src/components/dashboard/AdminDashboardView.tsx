import React, { useState } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { useAdminStats } from "../../hooks/useAdminStats";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { StatsCards } from "../admin/StatsCards";
import { UsersTable } from "../admin/UsersTable";
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
  } = useAdminUsers(page, 10);

  const handleRefreshAll = () => {
    if (activeTab === "overview") {
      refetchStats();
    } else {
      refetchUsers();
    }
  };

  const isRefreshing = isStatsRefetching || isUsersRefetching;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {activeTab === "overview" && "Analytics Overview"}
              {activeTab === "users" && "User Subscriptions"}
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              ADMIN
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === "overview" && "Monitor monthly recurring revenue, subscriber counts, and payment health."}
            {activeTab === "users" && "Search, view, and inspect all customer subscription states and billing records."}
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {activeTab === "users" && (
        <section aria-labelledby="users-heading" className="space-y-4 animate-in fade-in-50 duration-200">
          <UsersTable
            users={users}
            pagination={pagination}
            isLoading={isUsersLoading}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </section>
      )}
    </div>
  );
};
