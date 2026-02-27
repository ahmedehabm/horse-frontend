import { useCallback, useRef } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocketMessage } from "../../components/hooks/useWebSocketMessage";
import { Progress } from "@/components/ui/progress";
import { FeedingStatusPayload, HorsesStatsResponse } from "@/types";
import { useGetActiveFeedingStatus } from "../Horses/horseHooks";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface FeedingBarProps {
  horseId: string;
  horseName: string;
}

const progressMap: Record<string, number> = {
  PENDING: 10,
  STARTED: 30,
  RUNNING: 60,
  COMPLETED: 100,
  FAILED: 0,
};

export default function FeedingBar({ horseId, horseName }: FeedingBarProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { activeFeedingStatus, isFetching } =
    useGetActiveFeedingStatus(horseId);

  const handleFeedingStatus = useCallback(
    (data: FeedingStatusPayload) => {
      if (data.horseId !== horseId) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      queryClient.setQueryData<HorsesStatsResponse>(
        ["horses-stats"],
        (oldData) => {
          if (!oldData) {
            return {
              activeFeedings: [
                {
                  horseId: data.horseId,
                  feedingId: data.feedingId,
                  status: data.status,
                },
              ],
              activeStream: null,
            };
          }

          const existingIndex = oldData.activeFeedings.findIndex(
            (f) => f.horseId === horseId,
          );

          const updatedFeedings = [...oldData.activeFeedings];

          if (existingIndex >= 0) {
            updatedFeedings[existingIndex] = {
              horseId: data.horseId,
              feedingId: data.feedingId,
              status: data.status,
            };
          } else {
            updatedFeedings.push({
              horseId: data.horseId,
              feedingId: data.feedingId,
              status: data.status,
            });
          }

          return {
            ...oldData,
            activeFeedings: updatedFeedings,
          };
        },
      );

      // Show toast notifications
      if (data.status === "COMPLETED") {
        toast.success(t("feedNowBtn.feedingCompleted", { horseName }));
      }

      if (data.status === "FAILED") {
        toast.error(
          t("feedNowBtn.feedingFailed", {
            horseName,
            errorMessage:
              data.errorMessage || t("feedNowBtn.feedHorse", { horseName: "" }),
          }),
        );
      }

      // Remove from UI after 3 seconds for terminal states
      if (data.status === "COMPLETED" || data.status === "FAILED") {
        timeoutRef.current = setTimeout(() => {
          queryClient.setQueryData<HorsesStatsResponse>(
            ["horses-stats"],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                activeFeedings: oldData.activeFeedings.filter(
                  (f) => f.horseId !== horseId,
                ),
              };
            },
          );
        }, 3000);
      }
    },
    [horseId, horseName, queryClient, t],
  );

  useWebSocketMessage("FEEDING_STATUS", handleFeedingStatus);

  const feeding = activeFeedingStatus;
  if (isFetching || !feeding) return null;

  const progress = progressMap[feeding.status] ?? 0;

  const getStatusDisplay = () => {
    const base = {
      color: "text-slate-900",
      bgColor: "bg-white border-slate-200",
      icon: <FaSpinner className="animate-spin text-slate-400" />,
      text: t("feedingBar.status.pending"),
    };

    switch (feeding.status) {
      case "PENDING":
        return base;

      case "STARTED":
        return {
          ...base,
          text: t("feedingBar.status.started"),
        };

      case "RUNNING":
        return {
          ...base,
          text: t("feedingBar.status.running"),
        };

      case "COMPLETED":
        return {
          ...base,
          text: t("feedingBar.status.completed"),
          bgColor: "bg-emerald-50 border-emerald-200",
          icon: <FaCheckCircle className="text-emerald-600" />,
        };

      case "FAILED":
        return {
          ...base,
          text: t("feedingBar.status.failed"),
        };

      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();
  if (!statusDisplay) return null;

  return (
    <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
      <div className={`rounded-lg p-3 ${statusDisplay.bgColor} border`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {statusDisplay.icon}
            <span className={`text-sm font-medium ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <Progress
            value={progress}
            className="h-2"
            indicatorClassName={
              feeding.status === "COMPLETED"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                : feeding.status === "FAILED"
                  ? "bg-gradient-to-r from-rose-500 to-rose-600"
                  : "bg-gradient-to-r from-teal-500 to-teal-600"
            }
          />
          <div className="flex items-center justify-between text-xs">
            <span className={statusDisplay.color}>
              {t("feedingBar.progressComplete", { progress })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
