import { useQuery } from "@tanstack/react-query";
import { getAllUsersApi } from "../api/admin";

export const ADMIN_USERS_QUERY_KEY = ["admin-users"];

export const useAdminUsers = (page: number = 1, limit: number = 10) => {
  const query = useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, page, limit],
    queryFn: async () => {
      const res = await getAllUsersApi(page, limit);
      return res.data || { users: [], pagination: { total: 0, page, limit, totalPages: 0 } };
    },
    staleTime: 1000 * 30,
  });

  return {
    ...query,
    users: query.data?.users || [],
    pagination: query.data?.pagination || { total: 0, page, limit, totalPages: 0 },
  };
};
