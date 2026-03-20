// src/components/Feeding/StopFeedingBtn.tsx

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StopCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWebSocket } from "@/components/WebSocketContext";
import type { Horse } from "@/types";

interface StopFeedingBtnProps {
  horse: Horse;
  feedingStatus: "PENDING" | "STARTED" | "RUNNING" | "STOPPING";
  className?: string;
}

export default function StopFeedingBtn({
  horse,
  feedingStatus,
  className = "",
}: StopFeedingBtnProps) {
  const { t } = useTranslation();
  const { sendMessage } = useWebSocket();
  const queryClient = useQueryClient();

  const [showNormalStop, setShowNormalStop] = useState(false);
  const [showForceStop, setShowForceStop] = useState(false);

  const canForceStop = feedingStatus === "STOPPING";

  const handleStopFeeding = useCallback(() => {
    const success = sendMessage({ type: "STOP_FEEDING", horseId: horse.id });

    if (!success) {
      toast.error(t("feeding.stopFailed", "Failed to stop feeding"));
      return;
    }
    setShowNormalStop(false);
  }, [horse.id, sendMessage, queryClient, t]);

  const handleForceStop = useCallback(() => {
    const success = sendMessage({
      type: "FORCE_STOP_FEEDING",
      horseId: horse.id,
    });

    if (!success) {
      toast.error(t("feeding.forceStopFailed", "Failed to force stop"));
      return;
    }

    setShowForceStop(false);
  }, [horse.id, sendMessage, queryClient, t]);

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        {/* Normal Stop Button */}
        <button
          onClick={() => setShowNormalStop(true)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm text-white bg-red-500 hover:bg-red-600"
          disabled={feedingStatus === "STOPPING"}
        >
          <StopCircle className="h-4 w-4" />
          {feedingStatus === "STOPPING"
            ? t("feeding.stopping", "Stopping...")
            : t("feeding.stopFeeding", "Stop Feeding")}
        </button>

        {/* Force Stop Button (only if already stopping) */}
        {canForceStop && (
          <Button
            onClick={() => setShowForceStop(true)}
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Normal Stop Confirmation */}
      <AlertDialog open={showNormalStop} onOpenChange={setShowNormalStop}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("feeding.stopFeedingTitle", "Stop Feeding?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "feeding.stopFeedingDescription",
                "This will send a stop command to the feeder device. The device will stop feeding {{horseName}}.",
                { horseName: horse.name },
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStopFeeding}>
              {t("feeding.stopFeeding", "Stop Feeding")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Force Stop Confirmation */}
      <AlertDialog open={showForceStop} onOpenChange={setShowForceStop}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("feeding.forceStopTitle", "Force Stop Feeding?")}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-semibold text-destructive">
                {t(
                  "feeding.forceStopWarning",
                  "⚠️ WARNING: This is a manual override.",
                )}
              </p>
              <p>
                {t(
                  "feeding.forceStopDescription",
                  "The device did not respond to the stop command. This will manually mark the feeding as stopped WITHOUT device confirmation.",
                )}
              </p>
              <p className="text-sm">
                {t(
                  "feeding.forceStopNote",
                  "Use this only if the device is offline or not responding.",
                )}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleForceStop}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("feeding.forceStop", "Force Stop")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
