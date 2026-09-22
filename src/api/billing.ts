import { apiClient } from "./axios";
import {
  MyPlansResponse,
  GenerateLinkResponse,
  CancelSubscriptionResponse,
  CancelSubscriptionPayload,
} from "../types";

export const getMyPlansApi = async (
  page: number = 1,
  limit: number = 10
): Promise<MyPlansResponse> => {
  try {
    const response = await apiClient.get<MyPlansResponse>("/api/myActivePlans", {
      params: { page, limit },
    });
    return response.data;
  } catch (error: any) {
    // If backend returns 400 for "Subscrptions not found", normalize it as an empty subscription list
    if (
      error.response?.status === 400 &&
      error.response?.data?.message?.toLowerCase().includes("not found")
    ) {
      return {
        message: "No subscription found",
        subscriptions: [],
        getAllActiveSubscrptions: [],
        pagination: { page, perPageLimit: limit, totalNumberOfDocuments: 0 },
      };
    }
    throw error;
  }
};

export const generateLinkApi = async (): Promise<GenerateLinkResponse> => {
  const response = await apiClient.post<GenerateLinkResponse>("/api/billing/generate-link", { useSdk: true });
  return response.data;
};

export const cancelSubscriptionApi = async (
  payload?: CancelSubscriptionPayload
): Promise<CancelSubscriptionResponse> => {
  const response = await apiClient.post<CancelSubscriptionResponse>(
    "/api/subscriptions/cancel",
    payload || {}
  );
  return response.data;
};
