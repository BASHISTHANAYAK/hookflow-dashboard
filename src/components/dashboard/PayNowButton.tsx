import React, { useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateLinkApi } from "../../api/billing";
import { useAuthStore } from "../../store/authStore";
import { RazorpayOptions } from "../../types";
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

interface PayNowButtonProps extends Omit<ButtonProps, "onClick"> {
  onSuccess?: () => void;
  label?: string;
  isCardUpdate?: boolean;
}

export const PayNowButton: React.FC<PayNowButtonProps> = ({
  onSuccess,
  label,
  isCardUpdate = false,
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

      const subId = data.subscriptionId || data.razorpaySubscriptionId;
      const requiresCardUpdate =
        Boolean(data.requiresCardUpdate) || isCardUpdate;

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
      const options: RazorpayOptions = {
        key: razorpayKey,
        subscription_id: subId,
        subscription_card_change: requiresCardUpdate ? 1 : 0,
        name: "HookFlow",
        description: requiresCardUpdate
          ? "Update payment card for recurring subscription"
          : "Monthly Subscription (499/mo)",
        prefill: {
          email: user?.email,
          contact: user?.phoneNumber,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: function (_response) {
          // Payment successful - popup closes, stay on site and refresh subscription data
          toast.success(
            requiresCardUpdate
              ? "Payment method updated successfully!"
              : "Payment successful! Your subscription is now active."
          );
          if (onSuccess) {
            onSuccess();
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
