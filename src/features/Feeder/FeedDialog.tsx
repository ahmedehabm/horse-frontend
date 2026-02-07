import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Horse } from "@/types";
import { useWebSocket } from "@/components/WebSocketContext";

interface FeedAmountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horse: Horse;
}

export default function FeedDialog({
  open,
  onOpenChange,
  horse,
}: FeedAmountDialogProps) {
  const { isConnected, sendMessage } = useWebSocket();

  const [amount, setAmount] = useState<string>("2.5");

  const handleSubmit = useCallback(() => {
    if (!isConnected) {
      toast.error("Not connected to server.");
      return;
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid feeding amount (kg).");
      return;
    }

    const message = {
      type: "FEED_NOW" as const,
      horseId: horse.id,
      amountKg: parsedAmount,
    };

    const success = sendMessage(message);

    if (success) {
      toast.loading(`Sending feed command for ${horse.name}...`, {
        duration: 2000,
      });
      onOpenChange(false);
    } else {
      toast.error("Failed to send feed command. Please try again.");
    }
  }, [amount, horse, isConnected, sendMessage, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Feed {horse.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (kg)</label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 2.5"
          />
          <p className="text-xs text-muted-foreground">
            Enter a positive number (kg)
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Confirm Feed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
