import React, { useState } from "react";
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Zap,
} from "lucide-react";
import { formatDate, formatCurrency } from "../../lib/utils";
import { Subscription } from "../../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import { PayNowButton } from "./PayNowButton";
import { CancelModal } from "./CancelModal";

interface SubscriptionCardProps {
  subscription: Subscription | null | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  onCancel: () => Promise<any>;
  isCancelling: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
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

  // 2. Case: No active subscription found
  if (!subscription) {
    return (
      <Card className="w-full overflow-hidden border-dashed border-2 border-border/80 bg-gradient-to-b from-card to-card/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-medium text-xs tracking-wider uppercase">
              <Zap className="h-4 w-4" />
              Pro Webhook Management
            </div>
            <StatusBadge status="None" />
          </div>
          <CardTitle className="text-2xl font-bold mt-1">No Active Subscription</CardTitle>
          <CardDescription className="text-sm">
            Unlock automated webhook retry workflows, phone alerts, and full analytics.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl bg-secondary/50 p-4 border border-border/60">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-foreground">₹499</span>
                <span className="text-sm text-muted-foreground ml-1">/ month</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full">
                Recurring Billing
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                Unlimited automated webhook delivery & retries
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                WhatsApp instant alerts for failed webhooks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                Zero transaction lock-in &bull; Cancel anytime
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <PayNowButton
            label="Subscribe Now (₹499/mo)"
            size="lg"
            className="w-full sm:w-auto shadow-md"
            onSuccess={onRefresh}
          />
        </CardFooter>
      </Card>
    );
  }

  // Handle various subscription statuses:
  const isOverdue = subscription.status === "Overdue";
  const isActive = subscription.status === "Active";
  const isPending = subscription.status === "Pending";
  const isCancelled = subscription.status === "Cancelled";

  return (
    <>
      <Card className={`w-full overflow-hidden transition-all duration-200 shadow-md ${
        isOverdue ? "border-rose-300 dark:border-rose-900/60 shadow-rose-500/5" : ""
      }`}>
        {/* Overdue Urgent Alert Banner */}
        {isOverdue && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-500 text-white px-6 py-3.5 text-sm font-medium shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-white animate-pulse" />
              <span>
                <strong>Payment Failed.</strong> Your card could not be charged. Please update your payment method to restore webhook services.
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
                HookFlow Pro Subscription
              </span>
            </div>
            <StatusBadge status={subscription.status} />
          </div>
          <CardTitle className="text-2xl font-bold mt-1">
            {isActive && "Active Subscription"}
            {isOverdue && "Subscription Overdue"}
            {isPending && "Payment Pending Confirmation"}
            {isCancelled && "Subscription Cancelled"}
          </CardTitle>
          <CardDescription>
            {isActive && `All automated webhook pipelines and retry workers are operating smoothly.`}
            {isOverdue && `Scheduled retry worker paused pending card authorization update.`}
            {isPending && `Complete the checkout link to activate your recurring billing.`}
            {isCancelled && `Billing is cancelled. Access remains valid until ${formatDate(subscription.dueDate)}.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Amount */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">Billing Rate</div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                {formatCurrency(subscription.amount || 499)}
                <span className="text-xs font-normal text-muted-foreground"> /mo</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                GST Included
              </div>
            </div>

            {/* Next Billing / Due Date */}
            <div className={`rounded-xl border p-4 shadow-sm ${
              isOverdue
                ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20"
                : "border-border/70 bg-card"
            }`}>
              <div className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span>{isCancelled ? "Access Valid Until" : isOverdue ? "Overdue Since" : "Next Billing Date"}</span>
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className={`mt-1 text-lg font-bold ${
                isOverdue ? "text-rose-600 dark:text-rose-400" : "text-foreground"
              }`}>
                {formatDate(subscription.dueDate)}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {isActive && "Auto-debit via Razorpay"}
                {isOverdue && "Payment collection overdue"}
                {isCancelled && "No future renewals scheduled"}
                {isPending && "Awaiting first invoice completion"}
              </div>
            </div>

            {/* Subscription ID */}
            <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="text-xs font-medium text-muted-foreground">Subscription ID</div>
              <div className="mt-1 font-mono text-xs font-semibold text-foreground truncate" title={subscription.razorpaySubscriptionId || "N/A"}>
                {subscription.razorpaySubscriptionId || "Generating..."}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Razorpay ID Reference
              </div>
            </div>
          </div>

          {/* Pending or Overdue Callout */}
          {isPending && subscription.paymentLink && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-900 dark:text-amber-200">
                  Your payment link was generated. Please finish the checkout to activate.
                </span>
              </div>
              <a
                href={subscription.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-full sm:w-auto"
              >
                <Button size="sm" variant="default" className="w-full gap-2">
                  Complete Payment
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-6 py-4">
          <div className="text-xs text-muted-foreground">
            {isActive && `Protected by 256-bit encryption &bull; Immediate plan control`}
            {isOverdue && `Update payment method to prevent automatic webhook deactivation.`}
            {isCancelled && `Plan status is currently inactive.`}
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

            {/* If Active, show Cancel Subscription button */}
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

            {/* If Pending without paymentLink, allow generating one */}
            {isPending && !subscription.paymentLink && (
              <PayNowButton
                label="Complete Checkout"
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
