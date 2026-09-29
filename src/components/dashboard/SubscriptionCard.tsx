import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  Zap,
  PauseCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "../../lib/utils";
import { Subscription, PlanInfo } from "../../types";
import { getMyPlansApi } from "../../api/billing";
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
  onRefresh: (verifyData?: any) => void | Promise<any>;
  onCancel: (payload?: any) => Promise<any>;
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
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePaymentProcessing = () => {
    setIsPaymentProcessing(true);
    toast.loading(
      "Payment Processing: Payment method updated. Waiting for confirmation...",
      { id: "payment-processing", duration: 60000 }
    );

    let attempts = 0;
    const maxAttempts = 20;
    const pollInterval = setInterval(async () => {
      attempts++;
      try {
        const freshData = await getMyPlansApi();
        const activeSub = freshData.subscriptions?.[0] || freshData.getAllActiveSubscrptions?.[0];

        if (activeSub && activeSub.status === "Active") {
          clearInterval(pollInterval);
          setIsPaymentProcessing(false);
          toast.dismiss("payment-processing");
          toast.success("Payment confirmed! Your subscription is now active.");
          onRefresh();
          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setIsPaymentProcessing(false);
          toast.dismiss("payment-processing");
          toast.info(
            "Payment is taking a moment to process. Please refresh the page shortly.",
            { duration: 5000 }
          );
          onRefresh();
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setIsPaymentProcessing(false);
          toast.dismiss("payment-processing");
          onRefresh();
        }
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      toast.dismiss("payment-processing");
    };
  }, []);

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

  const userHasSubscription = Boolean(hasSubscription || subscription);

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
            Subscribe now to unlock all premium features, and alerts.
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

  const isPaymentFailed = subscription.status === "PaymentFailed";
  const isHalted = subscription.status === "Halted";
  const isOverdue = isPaymentFailed || isHalted;
  const isActive = subscription.status === "Active";
  const isPending = subscription.status === "Pending";
  const isCancelled = subscription.status === "Cancelled";
  const isCompleted = subscription.status === "Completed";
  const isPaused = subscription.status === "Paused";

  const billingRateAmount = subscription.amount ?? planInfo?.price;
  const billingCurrency = planInfo?.currency || "INR";
  const billingDurationLabel = planInfo?.duration
    ? ` / ${planInfo.duration}`
    : " / month";

  return (
    <>
      <Card
        className={`w-full overflow-hidden transition-all duration-200 shadow-md ${
          isPaymentProcessing
            ? "border-amber-300 dark:border-amber-900/60 shadow-amber-500/5"
            : isOverdue
            ? "border-rose-300 dark:border-rose-900/60 shadow-rose-500/5"
            : isPaused
            ? "border-amber-300 dark:border-amber-900/60 shadow-amber-500/5"
            : ""
        }`}
      >
        {isPaymentProcessing && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-500 text-white px-6 py-3.5 text-sm font-medium shadow-sm">
            <div className="flex items-center gap-2.5">
              <Loader2 className="h-5 w-5 shrink-0 text-white animate-spin" />
              <span>
                <strong>Payment Processing.</strong> Payment method updated. Waiting for confirmation from Razorpay...
              </span>
            </div>
          </div>
        )}

        {!isPaymentProcessing && isOverdue && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-500 text-white px-6 py-3.5 text-sm font-medium shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-white animate-pulse" />
              <span>
                <strong>Payment Failed.</strong> {isPaymentFailed ? "Update payment card to restore access." : "Please renew to restore access."}
              </span>
            </div>
            <PayNowButton
              label={isPaymentFailed ? "Update Payment Card" : "Activate Your Subscription"}
              isCardUpdate={isPaymentFailed}
              variant="secondary"
              size="sm"
              className="bg-white text-rose-700 hover:bg-white/90 shadow-sm shrink-0 w-full sm:w-auto"
              onSuccess={onRefresh}
              onPaymentProcessing={handlePaymentProcessing}
            />
          </div>
        )}

        {isPaused && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-500 text-white px-6 py-3.5 text-sm font-medium shadow-sm">
            <div className="flex items-center gap-2.5">
              <PauseCircle className="h-5 w-5 shrink-0 text-white" />
              <span>
                <strong>Subscription Paused.</strong> Your subscription is currently paused. Please contact an admin to resume your subscription.
              </span>
            </div>
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
            <StatusBadge status={isPaymentProcessing ? "Processing" : subscription.status} />
          </div>
          <CardTitle className="text-2xl font-bold mt-1">
            {isPaymentProcessing && "Payment Processing"}
            {!isPaymentProcessing && isActive && "Active Subscription"}
            {!isPaymentProcessing && isOverdue && "Subscription Overdue"}
            {!isPaymentProcessing && isPending && "Payment Pending"}
            {!isPaymentProcessing && isCancelled && "Subscription Cancelled"}
            {!isPaymentProcessing && isCompleted && "Subscription Completed"}
            {!isPaymentProcessing && isPaused && "Subscription Paused"}
          </CardTitle>
          <CardDescription>
            {isPaymentProcessing && "Your payment method was updated. We are confirming your payment with Razorpay..."}
            {!isPaymentProcessing && isActive && "Your subscription is active."}
            {!isPaymentProcessing && isPaymentFailed && "Payment failed on due date. Update your payment card to restore access."}
            {!isPaymentProcessing && isHalted && "All payment retries exhausted. Please renew your subscription to reactivate your plan."}
            {!isPaymentProcessing && isPending && "Complete checkout to activate your recurring subscription."}
            {!isPaymentProcessing && isCancelled && "Billing is cancelled. Your subscription has ended."}
            {!isPaymentProcessing && isCompleted && "All billing cycles have been completed."}
            {!isPaymentProcessing && isPaused && "Your subscription is currently paused. Please contact an admin to resume your subscription."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {!isCancelled && !isCompleted && (
              <div
                className={`rounded-xl border p-4 shadow-sm ${
                  isOverdue
                    ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20"
                    : "border-border/70 bg-card"
                }`}
              >
                <div className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>
                    {isOverdue
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
                  {isPaymentFailed && "Payment collection overdue • action required"}
                  {isHalted && "Payment collection overdue • Plan halted"}
                  {isPending && "Awaiting initial checkout"}
                  {isPaused && "Billing temporarily paused"}
                </div>
              </div>
            )}

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
            {isPaymentProcessing && "Payment processing in background • Refreshing shortly"}
            {!isPaymentProcessing && isActive && "Protected by 256-bit encryption • Immediate plan control"}
            {!isPaymentProcessing && isOverdue && (isPaymentFailed ? "Update payment card to restore access." : "Renew plan to restore access.")}
            {!isPaymentProcessing && isCancelled && <span className="text-destructive font-medium">Plan status: Cancelled</span>}
            {!isPaymentProcessing && isCompleted && "All cycles completed."}
            {!isPaymentProcessing && isPaused && <span className="text-amber-600 dark:text-amber-400 font-medium">Subscription paused. Contact admin to resume.</span>}
            {!isPaymentProcessing && isPending && "Pending checkout completion."}
          </div>

          <div className="flex items-center gap-2">
            {isOverdue && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={isCancelling || isPaymentProcessing}
                  className="text-muted-foreground hover:text-destructive hover:border-destructive/50"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                </Button>
                {isPaymentProcessing ? (
                  <Button size="sm" variant="secondary" disabled className="gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </Button>
                ) : (
                  <PayNowButton
                    label={isPaymentFailed ? "Update Payment Card" : "Activate Your Subscription"}
                    isCardUpdate={isPaymentFailed}
                    variant="destructive"
                    size="sm"
                    onSuccess={onRefresh}
                    onPaymentProcessing={handlePaymentProcessing}
                  />
                )}
              </>
            )}

            {isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={isCancelling}
                className="text-muted-foreground hover:text-destructive hover:border-destructive/50"
              >
                {isCancelling ? "Cancelling..." : "Cancel Subscription"}
              </Button>
            )}

            {isCancelled && (
              <PayNowButton
                label="Resubscribe"
                variant="default"
                size="sm"
                onSuccess={onRefresh}
              />
            )}

            {isPending && (
              <PayNowButton
                label="Complete Payment"
                variant="default"
                size="sm"
                onSuccess={onRefresh}
              />
            )}

            {isCompleted && (
              <PayNowButton
                label="Activate Your Subscription"
                variant="default"
                size="sm"
                onSuccess={onRefresh}
              />
            )}
          </div>
        </CardFooter>
      </Card>

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={async () => {
          await onCancel({ subscriptionId: subscription.razorpaySubscriptionId });
          setIsCancelModalOpen(false);
        }}
        isLoading={isCancelling}
      />
    </>
  );
};
