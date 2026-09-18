import React from "react";
import {
  Activity,
  ShieldCheck,
  BellRing,
  RefreshCw,
  Info,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useSubscription } from "../hooks/useSubscription";
import { AppShell } from "../components/layout/AppShell";
import { SubscriptionCard } from "../components/dashboard/SubscriptionCard";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    subscription,
    isLoading,
    isRefetching,
    refresh,
    cancelSubscription,
    isCancelling,
  } = useSubscription();

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in-50 duration-300">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Customer Portal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your HookFlow subscription, payment credentials, and webhook alert channels.
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
              Refresh Status
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

        {/* Feature Capabilities & Platform Overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
                  <Activity className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Automated Retries
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Configured exponential backoff retries with dead-letter queue routing whenever your target servers respond with non-2xx status codes.
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <BellRing className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-semibold">
                  WhatsApp Alerting
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Instant alerts dispatched directly to {user?.phoneNumber || "your phone"} on recurring payment events, failures, and mission-critical webhook halts.
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Razorpay Auto-Debit
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Subscription renewals are authorized securely via RBI-compliant e-mandates. Zero hidden charges and instantaneous self-service cancellation.
            </CardContent>
          </Card>
        </section>

        {/* Account Metadata Notice */}
        <div className="rounded-xl border border-border/80 bg-card/60 p-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>
              Signed in with account <strong>{user?.email}</strong> &bull; Token valid for 10 hours.
            </span>
          </div>
          <span className="text-[11px] font-mono bg-secondary px-2 py-1 rounded">
            Role: {user?.role}
          </span>
        </div>
      </div>
    </AppShell>
  );
};
