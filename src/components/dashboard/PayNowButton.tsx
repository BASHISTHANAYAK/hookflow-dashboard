import React, { useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateLinkApi, verifySubscriptionApi } from "../../api/billing";
import { useAuthStore } from "../../store/authStore";
import { RazorpayOptions, VerifySubscriptionResponse } from "../../types";
import { Button, ButtonProps } from "../ui/button";

// Dynamically load Razorpay checkout.js SDK
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window.Razorpay === "function") {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

interface PayNowButtonProps extends Omit<ButtonProps, "onClick" | "onError"> {
  onSuccess?: (verifyData?: VerifySubscriptionResponse) => void | Promise<void>;
  onError?: (error: string) => void;
  label?: string;
  isCardUpdate?: boolean;
  planDescription?: string;
}

export const PayNowButton: React.FC<PayNowButtonProps> = ({
  onSuccess,
  onError,
  label,
  isCardUpdate = false,
  planDescription,
  variant = "default",
  size = "default",
  className,
  ...props
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthStore();
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const handleSubscribe = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      toast.info("Preparing checkout modal...", { duration: 2000 });

      // 1. Call backend to generate subscription/link
      const data = await generateLinkApi();

      // Task 2: Handle Paused status error (or backend returning success: false with message)
      if (data.success === false) {
        toast.error("Subscription Notice", {
          description:
            data.message ||
            "Your subscription is currently paused. Please contact an admin to resume your subscription.",
        });
        return;
      }

      const subId = data.subscriptionId || data.razorpaySubscriptionId;
      // Task 1: Respect backend requiresCardUpdate flag (overrides initial prop)
      const requiresCardUpdate =
        typeof data.requiresCardUpdate === "boolean"
          ? data.requiresCardUpdate
          : Boolean(data.requiresCardUpdate) || isCardUpdate;

      if (!subId) {
        throw new Error(
          data.message || "Failed to retrieve subscription ID from server."
        );
      }

      // 2. Ensure Razorpay checkout.js SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window.Razorpay !== "function") {
        throw new Error(
          "Unable to load Razorpay payment SDK. Please check your internet connection or ad-blocker."
        );
      }

      // 3. Open Razorpay Checkout as a popup/modal overlay on the current page
      const orderId = data.orderId || data.order_id;

      const options: RazorpayOptions = {
        key: razorpayKey,
        subscription_id: subId,
        subscription_card_change: requiresCardUpdate ? 1 : 0,
        // Only include order_id for NEW subscriptions, not card updates
        ...(requiresCardUpdate ? {} : (orderId ? { order_id: orderId } : {})),
        name: "HookFlow",
        description: requiresCardUpdate
          ? "Update payment card for recurring subscription"
          : (planDescription || "HookFlow Subscription"),
        prefill: {
          email: user?.email,
          contact: user?.phoneNumber,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async function (response) {
          try {
            toast.loading("Verifying payment...", { id: "verify-payment" });

            const targetSubId = response.razorpay_subscription_id || subId;
            const targetPaymentId = response.razorpay_payment_id;

            // Task 1: Synchronous verification call to backend
            const verifyData = await verifySubscriptionApi({
              subscriptionId: targetSubId,
              paymentId: targetPaymentId,
            });

            toast.dismiss("verify-payment");

            if (verifyData.success && verifyData.status === "Active") {
              // Payment confirmed successfully
              toast.success(
                requiresCardUpdate
                  ? "Payment method updated successfully!"
                  : "Payment confirmed! Welcome to Premium."
              );
              if (onSuccess) {
                await onSuccess(verifyData);
              }
            } else {
              // Payment verification failed or status not Active
              const errorMsg =
                verifyData.message ||
                `Payment verification returned status: ${verifyData.status || "unconfirmed"}`;
              onError?.(errorMsg);
              toast.error("Payment Verification Notice", {
                description: errorMsg,
              });
              if (onSuccess) {
                await onSuccess(verifyData);
              }
            }
          } catch (err: any) {
            // Task 2: Network or server error - rely on webhook backup gracefully
            toast.dismiss("verify-payment");
            console.warn("Verification call failed, relying on webhook backup:", err);
            const errorMsg =
              err.response?.data?.message ||
              err.message ||
              "Verification failed, please refresh page";
            onError?.(errorMsg);
            toast.error("Verification Notice", {
              description:
                "Verification failed. If payment was successful, please refresh the page.",
            });
            if (onSuccess) {
              await onSuccess();
            }
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Checkout was closed without completing.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not initiate checkout. Please try again.";
      toast.error("Checkout Failed", {
        description: msg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const defaultLabel = isCardUpdate
    ? "Update Payment Card"
    : "Subscribe Now";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSubscribe}
      isLoading={isProcessing}
      className={`gap-2 ${className || ""}`}
      {...props}
    >
      {isCardUpdate ? (
        <RefreshCw className="h-4 w-4" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {label || defaultLabel}
    </Button>
  );
};
