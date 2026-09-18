import React, { useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateLinkApi } from "../../api/billing";
import { useAuthStore } from "../../store/authStore";
import { Button, ButtonProps } from "../ui/button";

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
  const razorpayKey =
    import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TcFM2YEgkip1tu";

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      toast.info("Preparing checkout session...", { duration: 2500 });
      const data = await generateLinkApi();

      const subId =
        data.subscriptionId || data.razorpaySubscriptionId;
      const requiresCardUpdate =
        Boolean(data.requiresCardUpdate) || isCardUpdate;

      // Check if Razorpay SDK script is loaded in window
      if (typeof window.Razorpay === "function" && subId) {
        const options = {
          key: razorpayKey,
          subscription_id: subId,
          subscription_card_change: requiresCardUpdate ? 1 : 0,
          name: "HookFlow SaaS",
          description: requiresCardUpdate
            ? "Update payment method for recurring subscription"
            : "HookFlow Monthly Subscription",
          prefill: {
            email: user?.email,
            contact: user?.phoneNumber,
          },
          theme: {
            color: "#4f46e5",
          },
          handler: async (_response: any) => {
            toast.success(
              requiresCardUpdate
                ? "Card updated successfully!"
                : "Payment processed successfully! Updating plan..."
            );
            if (onSuccess) {
              onSuccess();
            }
          },
          modal: {
            ondismiss: () => {
              toast.info("Checkout was closed without completing.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (data.paymentLink) {
        // Fallback: If Razorpay SDK is blocked by adblock or not loaded, open the generated payment link
        toast.info("Opening Razorpay payment gateway...");
        window.open(data.paymentLink, "_blank", "noopener,noreferrer");
        if (onSuccess) {
          setTimeout(onSuccess, 4000);
        }
      } else {
        throw new Error(
          data.message || "Failed to initialize checkout. Please try again."
        );
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not generate payment link. Please try again.";
      toast.error("Checkout Failed", {
        description: msg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const defaultLabel = isCardUpdate
    ? "Update Payment Card"
    : "Subscribe to HookFlow";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCheckout}
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
