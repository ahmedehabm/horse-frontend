import { useCallback, useState, useEffect } from "react";
import { FaVideo, FaSpinner, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/components/WebSocketContext";
import { useWebSocketMessage } from "@/components/hooks/useWebSocketMessage";
import { Horse, StreamStatusPayload, HorsesStatsResponse } from "@/types";
import StreamModal from "./StreamModal";
import { useGetActiveStreamStatus } from "../Horses/horseHooks";
import { useTranslation } from "react-i18next";

interface StreamBtnProps {
  horse: Horse;
  className?: string;
}

export default function StreamBtn({ horse, className = "" }: StreamBtnProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isConnected, sendMessage } = useWebSocket();
  const { activeStream, isFetching } = useGetActiveStreamStatus();

  const [modalOpen, setModalOpen] = useState(false);

  const isThisHorseActive = activeStream?.horseId === horse.id;
  const isPending = isThisHorseActive && activeStream?.status === "PENDING";
  const isStreaming = isThisHorseActive && activeStream?.status === "STARTED";
  const token = isStreaming ? (activeStream?.streamToken ?? null) : null;

  // Auto-open modal when streaming starts and token is available
  useEffect(() => {
    if (isStreaming && token) setModalOpen(true);
  }, [isStreaming, token]);

  /**
   * Handle stream status from WebSocket
   */
  const handleStreamStatus = useCallback(
    (data: StreamStatusPayload) => {
      if (data.horseId !== horse.id) return;
      if (data.status === "STARTED" && data.streamUrl) {
        const tokenMatch = data.streamUrl.match(/\/stream\/(.+)/);
        const extractedToken = tokenMatch?.[1];

        queryClient.setQueryData<HorsesStatsResponse>(
          ["horses-stats"],
          (oldData) => {
            if (!oldData) {
              return {
                activeFeedings: [],
                activeStream: {
                  horseId: data.horseId,
                  status: "STARTED",
                  streamToken: extractedToken,
                },
              };
            }
            return {
              ...oldData,
              activeStream: {
                horseId: data.horseId,
                status: "STARTED",
                streamToken: extractedToken,
              },
            };
          },
        );

        toast.success(t("streaming.liveStreamFor", { horseName: horse.name }));
      }

      // if (data.status === "STREAM_STOPPED") {
      //   queryClient.setQueryData<HorsesStatsResponse>(
      //     ["horses-stats"],
      //     (oldData) => {
      //       if (!oldData) return oldData;
      //       return { ...oldData, activeStream: null };
      //     },
      //   );

      //   setModalOpen(false);
      //   toast(t("streaming.streamStopped"), { icon: "📴" });
      // }
    },
    [horse.id, horse.name, queryClient, t],
  );

  useWebSocketMessage("STREAM_STATUS", handleStreamStatus, [
    handleStreamStatus,
  ]);

  /**
   * Start stream
   */
  const handleStartStream = useCallback(() => {
    if (!isConnected) {
      toast.error(t("streaming.notConnected", "Not connected to server."));
      return;
    }
    if (!horse.camera) {
      toast.error(
        t("streaming.noCamera", { horseName: horse.name }) ||
          `${horse.name} has no camera assigned.`,
      );
      return;
    }

    // Send the message FIRST
    const success = sendMessage({ type: "START_STREAM", horseId: horse.id });

    if (!success) {
      toast.error(t("streaming.startFailed", "Failed to start stream."));
      return;
    }

    // Only set optimistic PENDING state if sending was successful
    queryClient.setQueryData<HorsesStatsResponse>(
      ["horses-stats"],
      (oldData) => {
        if (!oldData)
          return {
            activeFeedings: [],
            activeStream: { horseId: horse.id, status: "PENDING" },
          };
        return {
          ...oldData,
          activeStream: { horseId: horse.id, status: "PENDING" },
        };
      },
    );

    // Don't show toast - let the WebSocket STREAM_STATUS handler show the success toast
  }, [isConnected, horse, sendMessage, queryClient, t]);
  /**
   * Stop stream
   */
  const handleStopStream = useCallback(() => {
    const success = sendMessage({ type: "STOP_STREAM", horseId: horse.id });

    if (!success) {
      toast.error(t("streaming.stopFailed", "Failed to stop stream"));
      return;
    }

    queryClient.setQueryData<HorsesStatsResponse>(
      ["horses-stats"],
      (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, activeStream: null };
      },
    );

    setModalOpen(false);
  }, [horse.id, sendMessage, queryClient, t]);

  // Loading state
  if (isFetching) {
    return (
      <button
        disabled
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm bg-gray-200 text-gray-500 ${className}`}
      >
        <FaSpinner className="animate-spin" />
        <span>{t("streaming.loading", "LOADING…")}</span>
      </button>
    );
  }

  // Another horse is streaming
  const anotherHorseStreaming =
    activeStream && activeStream.horseId !== horse.id;

  const isDisabled =
    !isConnected || isPending || !horse.camera || anotherHorseStreaming;

  const getButtonStyles = () => {
    if (isPending) return "bg-amber-500 text-white cursor-wait";
    if (anotherHorseStreaming || !horse.camera)
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    return "bg-primary text-primary-foreground hover:bg-primary/90";
  };

  const getButtonTitle = () => {
    if (!horse.camera)
      return t("streaming.noCamera", { horseName: horse.name });
    if (anotherHorseStreaming)
      return t("streaming.anotherHorseStreaming", "Another horse is streaming");
    if (isPending) return t("streaming.starting");
    return t("streaming.startStream");
  };

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        {/* Start Stream Button */}
        {!isStreaming && (
          <button
            onClick={handleStartStream}
            disabled={isDisabled!}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm ${getButtonStyles()}`}
            title={getButtonTitle()}
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>{t("streaming.starting")}</span>
              </>
            ) : (
              <>
                <FaVideo />
                <span>{t("streaming.startStream")}</span>
              </>
            )}
          </button>
        )}

        {/* View Stream Button */}
        {isStreaming && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm bg-emerald-500 text-white hover:bg-emerald-600"
            title={t("streaming.liveStreamFor", { horseName: horse.name })}
          >
            <FaEye />
            <span>{t("streaming.viewStream")}</span>
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </button>
        )}
      </div>

      {/* Stream Modal */}
      {isStreaming && token && (
        <StreamModal
          horse={horse}
          token={token}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onStopStream={handleStopStream}
        />
      )}
    </>
  );
}
