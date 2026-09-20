import React, { useState } from "react";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  Zap,
} from "lucide-react";
import { formatDate, formatCurrency } from "../../lib/utils";
import { Subscription, PlanInfo } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import { PayNowButton } from "./PayNowButton";
import { CancelModal } from "./CancelModal";

interface SubscriptionCardProps {
  subscription: Subscription | null | undefined;
  hasSubscription?: boolean;
  planInfo?: PlanInfo | null;
  isLoading: boolean;
  onRefresh: () => void;
  onCancel: () => Promise<any>;
  isCancelling: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  hasSubscription = false,
  planInfo,
  isLoading,
  onRefresh,
  onCancel,
  isCancelling,
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 1. Loading Skeleton State to prevent layout shift
  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden border-border/80 shadow-md">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-2">
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  // Determine if user has subscription
  const userHasSubscription = Boolean(hasSubscription || subscription);

  // 2. Case: User has NO active subscription
  if (!userHasSubscription || !subscription) {
    const formattedPrice =
      planInfo?.price !== undefined
        ? formatCurrency(planInfo.price, planInfo.currency)
        : null;

    const durationLabel = planInfo?.duration
      ? ` / ${planInfo.duration}`
      : " / month";

    const subscribeButtonLabel = formattedPrice
      ? `Subscribe Now (${formattedPrice})`
      : "Subscribe Now";

    return (
      <Card className="w-full overflow-hidden border-dashed border-2 border-border/80 bg-gradient-to-b from-card to-card/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase">
              <Zap className="h-4 w-4" />
              HookFlow Plan
            </div>
            <StatusBadge status="None" />
          </div>
          <CardTitle className="text-2xl font-bold mt-1">No Active Subscription</CardTitle>
          <CardDescription className="text-sm">
            Subscribe now to unlock all premium features, automated delivery, and alerts.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl bg-secondary/50 p-4 border border-border/60">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline">
                {formattedPrice ? (
                  <span className="text-3xl font-extrabold text-foreground">
                    {formattedPrice}
                  </span>
                ) : (
                  <Skeleton className="h-9 w-24 inline-block align-middle" />
                )}
                <span className="text-sm text-muted-foreground ml-1">
                  {durationLabel}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full">
                Recurring Billing
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                Full access to all platform features & workflows
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                Real-time delivery notifications & phone alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                Zero lock-in • Cancel online anytime
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          {/* Only show Subscribe Now button if hasSubscription is false */}
          <PayNowButton
            label={subscribeButtonLabel}
            planDescription={
              formattedPrice
                ? `HookFlow Subscription (${formattedPrice}${durationLabel})`
                : "HookFlow Subscription"
            }
            size="lg"
            className="w-full sm:w-auto shadow-md"
            onSuccess={onRefresh}
          />
        </CardFooter>
      </Card>
    );
  }

  // 3. Case: User HAS a subscription
  const isOverdue = subscription.status === "Overdue";
  const isActive = subscription.status === "Active";
  const isPending = subscription.status === "Pending";
  const isCancelled = subscription.status === "Cancelled";

  // Rate information directly from subscription with planInfo fallback
  const billingRateAmount = subscription.amount ?? planInfo?.price;
  const billingCurrency = planInfo?.currency || "INR";
  const billingDurationLabel = planInfo?.duration
    ? ` / ${planInfo.duration}`
    : " / month";

  return (
    <>
      <Card
        className={`w-full overflow-hidden transition-all duration-200 shadow-md ${
          isOverdue
            ? "border-rose-300 dark:border-rose-900/60 shadow-rose-500/5"
            : ""
        }`}
      >
        {/* Overdue Urgent Alert Banner */}
        {isOverdue && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-500 text-white px-6 py-3.5 text-sm font-medium shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-white animate-pulse" />
              <span>
                <strong>Payment Failed.</strong> Your card could not be charged. Please update your payment method to restore access.
              </span>
            </div>
            <PayNowButton
              label="Update Card Now"
              isCardUpdate={true}
              variant="secondary"
              size="sm"
              className="bg-white text-rose-700 hover:bg-white/90 shadow-sm shrink-0 w-full sm:w-auto"
              onSuccess={onRefresh}
            />
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Plan
              </span>
            </div>
            <StatusBadge status={subscription.status} />
          </div>
          <CardTitle className="text-2xl font-bold mt-1">
            {isActive && "Active Subscription"}
            {isOverdue && "Subscription Overdue"}
            {isPending && "Payment Pending"}
            {isCancelled && "Subscription Cancelled"}
          </CardTitle>
          <CardDescription>
            {isActive && "Your subscription is active and in good standing."}
            {isOverdue && "Payment could not be processed. Please update your card to continue service."}
            {isPending && "Complete checkout to activate your recurring subscription."}
            {isCancelled &&
              `Billing is cancelled. Access remains valid until ${formatDate(
                subscription.dueDate
              )}.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Amount / Rate */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">Billing Rate</div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                {billingRateAmount !== undefined && billingRateAmount !== null ? (
                  formatCurrency(billingRateAmount, billingCurrency)
                ) : (
                  <Skeleton className="h-8 w-20 inline-block" />
                )}
                <span className="text-xs font-normal text-muted-foreground">
                  {billingDurationLabel}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                GST Included
              </div>
            </div>

            {/* Next Billing / Due Date */}
            <div
              className={`rounded-xl border p-4 shadow-sm ${
                isOverdue
                  ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20"
                  : "border-border/70 bg-card"
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>
                  {isCancelled
                    ? "Access Valid Until"
                    : isOverdue
                    ? "Overdue Since"
                    : "Next Billing Date"}
                </span>
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div
                className={`mt-1 text-lg font-bold ${
                  isOverdue
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-foreground"
                }`}
              >
                {formatDate(subscription.dueDate)}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {isActive && "Auto-renews each billing cycle"}
                {isOverdue && "Payment collection overdue"}
                {isCancelled && "No future renewals scheduled"}
                {isPending && "Awaiting initial checkout"}
              </div>
            </div>

            {/* Subscription ID / Billing Reference */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">Billing Reference</div>
              <div
                className="mt-1 font-mono text-xs font-semibold text-foreground truncate"
                title={subscription.razorpaySubscriptionId || "—"}
              >
                {subscription.razorpaySubscriptionId || "—"}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Support Reference ID
              </div>
            </div>
          </div>

          {/* Pending Callout */}
          {isPending && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-900 dark:text-amber-200">
                  Your payment is pending confirmation. Complete checkout in the popup modal to activate your subscription.
                </span>
              </div>
              <PayNowButton
                label="Complete Payment"
                size="sm"
                variant="default"
                className="w-full sm:w-auto shrink-0 shadow-sm"
                onSuccess={onRefresh}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-6 py-4">
          <div className="text-xs text-muted-foreground">
            {isActive && "Protected by 256-bit encryption • Immediate plan control"}
            {isOverdue && "Update payment method to prevent automatic plan deactivation."}
            {isCancelled && "Plan status is currently inactive."}
            {isPending && "Pending checkout completion."}
          </div>

          <div className="flex items-center gap-2">
            {/* If Overdue, show Update Card button */}
            {isOverdue && (
              <PayNowButton
                label="Update Payment Card"
                isCardUpdate={true}
                variant="destructive"
                size="sm"
                onSuccess={onRefresh}
              />
            )}

            {/* If Active, show Cancel Subscription button (or Manage Subscription / Cancel) */}
            {isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={isCancelling}
                className="text-muted-foreground hover:text-destructive hover:border-destructive/50"
              >
                Cancel Subscription
              </Button>
            )}

            {/* If Cancelled, show Resubscribe button */}
            {isCancelled && (
              <PayNowButton
                label="Resubscribe"
                variant="default"
                size="sm"
                onSuccess={onRefresh}
              />
            )}

            {/* If Pending, allow completing checkout via modal */}
            {isPending && (
              <PayNowButton
                label="Complete Payment"
                variant="default"
                size="sm"
                onSuccess={onRefresh}
              />
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Cancellation Confirmation Dialog */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={async () => {
          await onCancel();
          setIsCancelModalOpen(false);
        }}
        isLoading={isCancelling}
        dueDate={formatDate(subscription.dueDate)}
      />
    </>
  );
};
