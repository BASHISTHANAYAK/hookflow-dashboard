import React, { useState, useEffect } from "react";
import {
  Terminal,
  AlertTriangle,
  Zap,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface SimulateFailurePanelProps {
  selectedUserId?: string;
  onSimulate: (userId: string) => Promise<any>;
  isSimulating: boolean;
}

export const SimulateFailurePanel: React.FC<SimulateFailurePanelProps> = ({
  selectedUserId = "",
  onSimulate,
  isSimulating,
}) => {
  const [userId, setUserId] = useState(selectedUserId);
  const [lastResult, setLastResult] = useState<{
    newStatus: string;
    newDueDate: string;
  } | null>(null);

  useEffect(() => {
    if (selectedUserId) {
      setUserId(selectedUserId);
    }
  }, [selectedUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || isSimulating) return;

    try {
      const res = await onSimulate(userId.trim());
      if (res?.data) {
        setLastResult(res.data);
      }
    } catch {
      // Toast is already triggered inside hook
    }
  };

  return (
    <Card id="dev-tools" className="border-border/80 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Terminal className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-bold">
              Dev Tools: Payment Failure Simulator
            </CardTitle>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md font-semibold">
            Sandbox Only
          </span>
        </div>
        <CardDescription className="text-xs">
          Force a user&apos;s subscription into the <code>Overdue</code> state to test customer retry alerts and queued WhatsApp notifications.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Warning Callout */}
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong>Developer Warning:</strong> This is a testing simulation endpoint. Executing this will trigger backend webhook queues and dispatch a simulated WhatsApp overdue notification to the user&apos;s registered phone number.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="userId" className="text-xs">Target User ID (MongoDB Object ID)</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="userId"
                placeholder="e.g. 64f1a2b3c4d5e6f7a8b9c0d1"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="font-mono text-xs flex-1"
                disabled={isSimulating}
                required
              />
              <Button
                type="submit"
                variant="destructive"
                isLoading={isSimulating}
                className="shrink-0 gap-2 text-xs"
              >
                <Zap className="h-3.5 w-3.5" />
                Simulate Payment Failure
              </Button>
            </div>
          </div>
        </form>

        {/* Output Banner */}
        {lastResult && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs space-y-2 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Simulation successfully executed!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1">
              <div>
                <strong>Updated Status:</strong>{" "}
                <span className="text-rose-600 font-semibold">{lastResult.newStatus}</span>
              </div>
              <div>
                <strong>New Due Date:</strong>{" "}
                <span className="font-mono">{lastResult.newDueDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 pt-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp notification event pushed to Redis queue.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
