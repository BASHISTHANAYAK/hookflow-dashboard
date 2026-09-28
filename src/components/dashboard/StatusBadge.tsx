import React from "react";
import { CheckCircle2, AlertCircle, Clock, XCircle, PauseCircle } from "lucide-react";
import { SubscriptionStatus } from "../../types";
import { Badge } from "../ui/badge";
import { getSubscriptionDisplayStatus } from "../../lib/utils";

interface StatusBadgeProps {
  status?: SubscriptionStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const displayStatus = getSubscriptionDisplayStatus(status);

  switch (displayStatus) {
    case "Active":
      return (
        <Badge variant="success" className={`gap-1.5 font-medium ${className}`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </Badge>
      );
    case "Overdue":
      return (
        <Badge variant="destructive" className={`gap-1.5 font-medium ${className}`}>
          <AlertCircle className="h-3.5 w-3.5" />
          Overdue
        </Badge>
      );
    case "Pending":
      return (
        <Badge variant="warning" className={`gap-1.5 font-medium ${className}`}>
          <Clock className="h-3.5 w-3.5" />
          Pending Checkout
        </Badge>
      );
    case "Cancelled":
      return (
        <Badge variant="secondary" className={`gap-1.5 font-medium text-muted-foreground ${className}`}>
          <XCircle className="h-3.5 w-3.5" />
          Cancelled
        </Badge>
      );
    case "Completed":
      return (
        <Badge variant="secondary" className={`gap-1.5 font-medium text-muted-foreground ${className}`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed
        </Badge>
      );
    case "Paused":
      return (
        <Badge variant="info" className={`gap-1.5 font-medium ${className}`}>
          <PauseCircle className="h-3.5 w-3.5" />
          Paused
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className={`gap-1.5 font-normal text-muted-foreground ${className}`}>
          {displayStatus && displayStatus !== "None" ? displayStatus : "No Plan"}
        </Badge>
      );
  }
};
