// src/features/Feeding/FeedDialog.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Horse } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useWebSocket } from "@/components/WebSocketContext";

interface FeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horse: Horse;
  maxWeight: number | null;
}

export default function FeedDialog({
  open,
  onOpenChange,
  horse,
  maxWeight,
}: FeedDialogProps) {
  const { t } = useTranslation();
  const { isConnected, sendMessage } = useWebSocket();
  const [amount, setAmount] = useState("2");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const amountNum = parseFloat(amount);

    // Validation 1: Check if valid number
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast.error(t("feedDialog.invalidAmount"));
      return;
    }

    // // Validation 2: Check if weight data is available
    // if (maxWeight === null) {
    //   toast.error(t("feedDialog.waitingForWeight"));
    //   return;
    // }

    // // Validation 3: Check if requested amount exceeds available weight
    // if (amountNum > maxWeight) {
    //   toast.error(
    //     t("feedDialog.exceedsAvailableWeight", {
    //       requested: amountNum.toFixed(2),
    //       available: maxWeight.toFixed(2),
    //     }),
    //   );
    //   return;
    // }

    if (!isConnected) {
      toast.error(t("feedDialog.notConnected"));
      return;
    }

    setIsSubmitting(true);

    // Send the message
    const success = sendMessage({
      type: "FEED_NOW",
      horseId: horse.id,
      amountKg: amountNum,
    });

    if (!success) {
      toast.error(t("feedDialog.error", "Something went wrong"));
    }

    // Success - command sent
    toast.success(t("feedDialog.sendingFeed", { name: horse.name }));
    onOpenChange(false);
    setAmount("");
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("feedDialog.title", { name: horse.name })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Show available weight */}
          {maxWeight !== null && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-sm text-blue-800">
                {t("feedDialog.availableWeight")}:{" "}
                <span className="font-semibold">{maxWeight.toFixed(2)} kg</span>
              </p>
            </div>
          )}

          {/* Show warning if no weight data */}
          {maxWeight === null && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
              <p className="text-sm text-yellow-800">
                {t("feedDialog.noWeightData")}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="amount">{t("feedDialog.amountLabel")}</Label>
            <Input
              id="amount"
              type="number"
              step="0.1"
              min="0.1"
              max={maxWeight ?? undefined}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("feedDialog.amountHint")}
              disabled={isSubmitting}
            />
            {maxWeight !== null && (
              <p className="text-xs text-gray-500 mt-1">
                {t("feedDialog.maxAmount", { max: maxWeight.toFixed(2) })}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("feedDialog.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              // disabled={isSubmitting || maxWeight === null}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("common.loading") : t("feedDialog.confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
