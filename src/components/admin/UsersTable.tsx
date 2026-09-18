import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  Terminal,
} from "lucide-react";
import { formatDate, formatCurrency } from "../../lib/utils";
import { AdminUser, Pagination } from "../../types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { StatusBadge } from "../dashboard/StatusBadge";

interface UsersTableProps {
  users: AdminUser[];
  pagination: Pagination;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onSelectUserForSimulation?: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  pagination,
  isLoading,
  onPageChange,
  onSelectUserForSimulation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(q) ||
      user.phoneNumber?.toLowerCase().includes(q) ||
      user.userId?.toLowerCase().includes(q) ||
      user.status?.toLowerCase().includes(q)
    );
  });

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || Math.ceil((pagination.total || 0) / (pagination.limit || 10)) || 1;

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search email, phone, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground self-end sm:self-center">
          Showing {filteredUsers.length} of {pagination.total || users.length} users
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-3.5">User / Email</th>
                <th scope="col" className="px-6 py-3.5">Phone Number</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5">Due Date</th>
                <th scope="col" className="px-6 py-3.5">Plan Rate</th>
                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-44" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.userId}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{u.email}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          ID: {u.userId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {u.phoneNumber || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {formatDate(u.dueDate)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatCurrency(u.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {onSelectUserForSimulation && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectUserForSimulation(u.userId)}
                          className="h-8 gap-1 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                          title="Fill user ID into Dev Failure Simulator"
                        >
                          <Terminal className="h-3.5 w-3.5" />
                          Simulate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-border p-4 space-y-3 bg-card">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No matching users found.
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.userId}
              className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-foreground">{u.email}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {u.userId}
                  </span>
                </div>
                <StatusBadge status={u.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{u.phoneNumber || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{formatDate(u.dueDate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(u.amount)}
                </span>
                {onSelectUserForSimulation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectUserForSimulation(u.userId)}
                    className="h-8 text-xs gap-1"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    Simulate Failure
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="h-8 gap-1 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="h-8 gap-1 text-xs"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
