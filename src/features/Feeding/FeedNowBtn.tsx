// src/components/FeedNowBtn.tsx
import { useState, useCallback, useRef, useEffect } from "react";
import { FaUtensils } from "react-icons/fa";
import toast from "react-hot-toast";
import { Horse } from "@/types";
import FeedDialog from "./FeedDialog";
import { useGetActiveFeedingStatus } from "../Horses/horseHooks";
import { useTranslation } from "react-i18next";
import { useFeederWeight } from "@/components/hooks/useFeederWeight";

export default function FeedNowBtn({
  horse,
  className = "",
}: {
  horse: Horse;
  className?: string;
}) {
  const { t } = useTranslation();
  const { activeFeedingStatus } = useGetActiveFeedingStatus(horse.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { weight: currentWeight } = useFeederWeight(horse.feeder?.thingName);

  const isFeedingInProgress =
    activeFeedingStatus &&
    ["PENDING", "STARTED", "RUNNING"].includes(activeFeedingStatus.status);

  // ❌ REMOVED: No longer listening here
  // useWebSocketMessage("FEEDING_STATUS", handleFeedingStatus);

  const handleOpenDialog = useCallback(() => {
    if (!horse.feeder) {
      toast.error(t("feedNowBtn.noFeeder"));
      return;
    }

    if (isFeedingInProgress) {
      toast.error(t("feedNowBtn.feedingInProgress"));
      return;
    }

    setDialogOpen(true);
  }, [horse, isFeedingInProgress, t]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isDisabled = !horse.feeder || isFeedingInProgress;

  const getButtonStyles = () => {
    if (isFeedingInProgress)
      return "bg-gray-400 text-gray-700 cursor-not-allowed";
    if (!horse.feeder) return "bg-gray-300 text-gray-500 cursor-not-allowed";
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
            ? t("feedNowBtn.noFeeder")
            : isFeedingInProgress
              ? t("feedNowBtn.feedingInProgress")
              : t("feedNowBtn.feedHorse", { horseName: horse.name })
        }
      >
        <FaUtensils className="text-sm" />
        <span>
          {isFeedingInProgress
            ? t("feedNowBtn.feeding")
            : t("feedNowBtn.feedNow")}
        </span>
      </button>

      <FeedDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        horse={horse}
        maxWeight={currentWeight}
      />
    </>
  );
}
