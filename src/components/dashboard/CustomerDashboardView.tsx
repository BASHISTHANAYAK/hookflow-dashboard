import React from "react";
import { RefreshCw } from "lucide-react";
import { useSubscription } from "../../hooks/useSubscription";
import { SubscriptionCard } from "./SubscriptionCard";
import { Button } from "../ui/button";

export const CustomerDashboardView: React.FC = () => {
  // Fetch subscription data ONLY for CUSTOMER users
  const {
    subscription,
    isLoading,
    isRefetching,
    refresh,
    cancelSubscription,
    isCancelling,
  } = useSubscription();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Clean Customer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Subscription & Billing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your active plan, payment method, and billing preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refresh()}
            isLoading={isRefetching}
            className="gap-1.5 text-xs shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Primary Subscription Status Card */}
      <section aria-labelledby="subscription-heading">
        <SubscriptionCard
          subscription={subscription}
          isLoading={isLoading}
          onRefresh={refresh}
          onCancel={cancelSubscription}
          isCancelling={isCancelling}
        />
      </section>
    </div>
  );
};
