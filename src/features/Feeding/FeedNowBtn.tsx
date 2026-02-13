import { useState, useCallback, useRef, useEffect } from "react";
import { FaUtensils } from "react-icons/fa";
import toast from "react-hot-toast";
import { useWebSocketMessage } from "@/components/hooks/useWebSocketMessage";
import { FeedingStatusPayload, Horse } from "@/types";
import FeedDialog from "./FeedDialog";
import { useGetActiveFeedingStatus } from "../Horses/horseHooks";

export default function FeedNowBtn({
  horse,
  className = "",
}: {
  horse: Horse;
  className: string;
}) {
  const { activeFeedingStatus } = useGetActiveFeedingStatus(horse.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   *  Feeding lock
   */
  const isFeedingInProgress =
    activeFeedingStatus &&
    ["PENDING", "STARTED", "RUNNING"].includes(activeFeedingStatus.status);

  /**
   *  WebSocket listener — feedback only
   */
  const handleFeedingStatus = useCallback(
    (data: FeedingStatusPayload) => {
      if (data.horseId !== horse.id) return;

      if (data.status === "COMPLETED") {
        toast.success(`🎉 Feeding ${horse.name} completed successfully!`);
      }

      if (data.status === "FAILED") {
        toast.error(
          `❌ Feeding ${horse.name} failed. ${
            data.errorMessage || "Please try again."
          }`,
        );
      }
    },
    [horse.id, horse.name],
  );

  useWebSocketMessage("FEEDING_STATUS", handleFeedingStatus, [
    handleFeedingStatus,
  ]);

  /**
   *  Open dialog only if allowed
   */
  const handleOpenDialog = useCallback(() => {
    if (!horse.feeder) {
      toast.error(`${horse.name} has no feeder assigned.`);
      return;
    }

    if (isFeedingInProgress) {
      toast.error(`🚫 ${horse.name} is already being fed. Please wait.`);
      return;
    }

    setDialogOpen(true);
  }, [horse, isFeedingInProgress]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isDisabled = !horse.feeder || isFeedingInProgress;

  const getButtonStyles = () => {
    if (isFeedingInProgress) {
      return "bg-gray-400 text-gray-700 cursor-not-allowed";
    }
    if (!horse.feeder) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    return "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-xl";
  };

  return (
    <>
      <button
        onClick={handleOpenDialog}
        disabled={isDisabled!}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm ${getButtonStyles()} ${className}`}
        title={
          !horse.feeder
            ? "No feeder assigned"
            : isFeedingInProgress
              ? "Feeding in progress — please wait"
              : `Feed ${horse.name}`
        }
      >
        <FaUtensils className="text-sm" />
        <span>{isFeedingInProgress ? "FEEDING…" : "FEED NOW"}</span>
      </button>

      <FeedDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        horse={horse}
      />
    </>
  );
}
