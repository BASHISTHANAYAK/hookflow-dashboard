import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllUsersApi, simulateFailureApi } from "../api/admin";
import { ADMIN_STATS_QUERY_KEY } from "./useAdminStats";

export const ADMIN_USERS_QUERY_KEY = ["admin-users"];

export const useAdminUsers = (page: number = 1, limit: number = 10) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, page, limit],
    queryFn: async () => {
      const res = await getAllUsersApi(page, limit);
      return res.data || { users: [], pagination: { total: 0, page, limit, totalPages: 0 } };
    },
    staleTime: 1000 * 30,
  });

  const simulateFailureMutation = useMutation({
    mutationFn: simulateFailureApi,
    onSuccess: (data) => {
      toast.success("Simulation Triggered", {
        description: data.message || "User marked as Overdue, WhatsApp reminder queued",
      });
      // Invalidate both users list and admin stats
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY });
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to simulate payment failure.";
      toast.error("Simulation failed", {
        description: msg,
      });
    },
  });

  return {
    ...query,
    users: query.data?.users || [],
    pagination: query.data?.pagination || { total: 0, page, limit, totalPages: 0 },
    simulateFailure: simulateFailureMutation.mutateAsync,
    isSimulating: simulateFailureMutation.isPending,
  };
};
