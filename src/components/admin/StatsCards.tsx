import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  AlertCircle,
  Calendar,
  Filter,
  RotateCcw,
} from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { AdminStats } from "../../types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

interface StatsCardsProps {
  stats?: AdminStats;
  isLoading: boolean;
  onFilterChange: (startDate?: string, endDate?: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  isLoading,
  onFilterChange,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(startDate || undefined, endDate || undefined);
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    onFilterChange(undefined, undefined);
  };

  return (
    <div className="space-y-4">
      {/* Date Range Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Analytics Filter</span>
        </div>

        <form
          onSubmit={handleApplyFilter}
          className="flex flex-wrap items-center gap-2 w-full sm:w-auto"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>From</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 text-xs w-36"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>To</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 text-xs w-36"
            />
          </div>

          <Button type="submit" size="sm" className="h-8 gap-1 text-xs">
            <Filter className="h-3 w-3" />
            Filter
          </Button>

          {(startDate || endDate) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilter}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </form>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <Card className="border-border/70 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Revenue (MRR)
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            {isLoading ? (
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <div className="mt-4">
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {formatCurrency(stats?.totalRevenue ?? 0)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Aggregated recurring collections
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-border/70 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Subscribers
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            {isLoading ? (
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            ) : (
              <div className="mt-4">
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {stats?.activeUsers ?? 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active paid customer accounts
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Failed Payments */}
        <Card className="border-border/70 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full pointer-events-none" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Failures
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            {isLoading ? (
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <div className="mt-4">
                <div className="text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
                  {stats?.failedPayments ?? 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accounts requiring card update
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
