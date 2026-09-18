import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyPlansApi,
  generateLinkApi,
  cancelSubscriptionApi,
} from "../api/billing";
import { Subscription } from "../types";

export const SUBSCRIPTION_QUERY_KEY = ["subscription"];

export const useSubscription = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: async () => {
      const response = await getMyPlansApi();
      const subscriptions = response.subscriptions || response.getAllActiveSubscrptions || [];
      // Return the most recent subscription if exists
      const latestSubscription: Subscription | null =
        subscriptions.length > 0 ? subscriptions[0] : null;
      return {
        all: subscriptions,
        current: latestSubscription,
        pagination: response.pagination,
      };
    },
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscriptionApi,
    onSuccess: (data) => {
      toast.success("Subscription cancelled", {
        description: data.message || "Your subscription has been cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel subscription.";
      toast.error("Cancellation error", {
        description: msg,
      });
    },
  });

  const generateLinkMutation = useMutation({
    mutationFn: generateLinkApi,
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate checkout link.";
      toast.error("Checkout error", {
        description: msg,
      });
    },
  });

  return {
    ...query,
    subscription: query.data?.current,
    allSubscriptions: query.data?.all || [],
    cancelSubscription: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
    generateLink: generateLinkMutation.mutateAsync,
    isGeneratingLink: generateLinkMutation.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY }),
  };
};
