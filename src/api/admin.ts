import { apiClient } from "./axios";
import {
  AdminStatsResponse,
  AdminUsersResponse,
  SimulateFailureResponse,
} from "../types";

export const getAdminStatsApi = async (
  startDate?: string,
  endDate?: string
): Promise<AdminStatsResponse> => {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await apiClient.get<AdminStatsResponse>("/api/admin/stats", {
    params,
  });
  return response.data;
};

export const getAllUsersApi = async (
  page: number = 1,
  limit: number = 10
): Promise<AdminUsersResponse> => {
  const response = await apiClient.get<AdminUsersResponse>("/api/admin/users", {
    params: { page, limit },
  });
  return response.data;
};

export const simulateFailureApi = async (
  userId: string
): Promise<SimulateFailureResponse> => {
  const response = await apiClient.post<SimulateFailureResponse>(
    "/api/admin/simulate-failure",
    { userId }
  );
  return response.data;
};
