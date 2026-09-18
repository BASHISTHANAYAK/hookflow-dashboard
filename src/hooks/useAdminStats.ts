import { useQuery } from "@tanstack/react-query";
import { getAdminStatsApi } from "../api/admin";

export const ADMIN_STATS_QUERY_KEY = ["admin-stats"];

export const useAdminStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: [...ADMIN_STATS_QUERY_KEY, startDate, endDate],
    queryFn: async () => {
      const res = await getAdminStatsApi(startDate, endDate);
      return (
        res.data || {
          totalRevenue: 0,
          activeUsers: 0,
          failedPayments: 0,
        }
      );
    },
    staleTime: 1000 * 60, // 1 minute
  });
};
