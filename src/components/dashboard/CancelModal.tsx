import React from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="gap-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive sm:mx-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl">Cancel Subscription?</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to cancel your subscription? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Immediate cancellation:</strong> Access will terminate right away with immediate effect. Razorpay will not auto-debit your account for any future months.
          </span>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Keep My Plan
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
