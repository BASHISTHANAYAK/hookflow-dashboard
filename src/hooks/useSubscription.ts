import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyPlansApi,
  generateLinkApi,
  cancelSubscriptionApi,
} from "../api/billing";
import { Subscription, CancelSubscriptionPayload } from "../types";

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
        hasSubscription: subscriptions.length > 0,
        planInfo: response.planInfo || null,
        pagination: response.pagination,
      };
    },
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  });

  const cancelMutation = useMutation({
    mutationFn: (payload?: CancelSubscriptionPayload) => cancelSubscriptionApi(payload),
    onSuccess: (data) => {
      // Optimistically update query cache immediately so UI reflects "Cancelled" state with zero latency
      queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          current: old.current ? { ...old.current, status: "Cancelled" } : null,
          all: (old.all || []).map((sub: any) => ({ ...sub, status: "Cancelled" })),
        };
      });

      toast.success("Subscription Cancelled", {
        description: data.message || "Subscription successfully cancelled with immediate effect.",
      });

      // Refetch to ensure backend synchronization
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to cancel subscription.";

      if (status === 400) {
        // "Subscription is already cancelled."
        toast.warning("Already Cancelled", {
          description: message,
        });
        // Sync cache because it's already cancelled
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      } else if (status === 404) {
        // "No subscription found for this user."
        toast.error("Subscription Not Found", {
          description: message,
        });
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      } else if (status === 502) {
        // "Razorpay failed to cancel the subscription. Please try again."
        toast.error("Payment Gateway Error", {
          description:
            error.response?.data?.message ||
            "Razorpay failed to cancel the subscription. Please try again.",
        });
      } else if (status === 401) {
        toast.error("Unauthorized", {
          description: "Your session has expired. Please log in again.",
        });
      } else {
        toast.error("Cancellation Failed", {
          description: message,
        });
      }
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
    hasSubscription: Boolean(query.data?.hasSubscription),
    planInfo: query.data?.planInfo,
    allSubscriptions: query.data?.all || [],
    cancelSubscription: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
    generateLink: generateLinkMutation.mutateAsync,
    isGeneratingLink: generateLinkMutation.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY }),
  };
};
