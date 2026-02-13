import { useCallback, useRef } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocketMessage } from "../../components/hooks/useWebSocketMessage";
import { Progress } from "@/components/ui/progress";
import { FeedingStatusPayload, HorsesStatsResponse } from "@/types";
import { useGetActiveFeedingStatus } from "../Horses/horseHooks";

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
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { activeFeedingStatus, isFetching } =
    useGetActiveFeedingStatus(horseId);

  const handleFeedingStatus = useCallback(
    (data: FeedingStatusPayload) => {
      if (data.horseId !== horseId) return;

      console.log(`📊 Feeding status for ${horseName}:`, data);

      // Clear pending hide timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // ✅ Update React Query cache directly
      queryClient.setQueryData<HorsesStatsResponse>(
        ["horses-stats"], // ✅ Fixed: no pagination
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

      // ✅ Clear from cache after completion / failure
      if (data.status === "COMPLETED" || data.status === "FAILED") {
        timeoutRef.current = setTimeout(() => {
          queryClient.setQueryData<HorsesStatsResponse>(
            ["horses-stats"], // ✅ Fixed: no pagination
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
    [horseId, horseName, queryClient],
  );

  useWebSocketMessage("FEEDING_STATUS", handleFeedingStatus, [
    handleFeedingStatus,
  ]);

  const feeding = activeFeedingStatus;

  if (isFetching || !feeding) return null;

  const progress = progressMap[feeding.status] ?? 0;

  const getStatusDisplay = () => {
    switch (feeding.status) {
      case "PENDING":
        return {
          text: "Feed request pending",
          color: "text-slate-700",
          bgColor: "bg-slate-50 border-slate-200",
          icon: <FaSpinner className="animate-spin text-slate-600" />,
        };
      case "STARTED":
        return {
          text: "Feeding started",
          color: "text-amber-800",
          bgColor: "bg-amber-50 border-amber-200",
          icon: <FaSpinner className="animate-spin text-amber-600" />,
        };
      case "RUNNING":
        return {
          text: "Feeding in progress",
          color: "text-teal-800",
          bgColor: "bg-teal-50 border-teal-200",
          icon: <FaSpinner className="animate-spin text-teal-600" />,
        };
      case "COMPLETED":
        return {
          text: "Feeding completed successfully",
          color: "text-emerald-800",
          bgColor: "bg-emerald-50 border-emerald-200",
          icon: <FaCheckCircle className="text-emerald-600" />,
        };
      case "FAILED":
        return {
          text: "Feeding failed",
          color: "text-rose-800",
          bgColor: "bg-rose-50 border-rose-200",
          icon: <span className="text-rose-600 text-lg font-semibold">✕</span>,
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
                  : feeding.status === "STARTED"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600"
                    : "bg-gradient-to-r from-teal-500 to-teal-600"
            }
          />
          <div className="flex items-center justify-between text-xs">
            <span className={statusDisplay.color}>{progress}% complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
