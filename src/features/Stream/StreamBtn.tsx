// features/Stream/StreamBtn.tsx
import { useCallback, useState, useEffect } from "react";
import { FaVideo, FaSpinner, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/components/WebSocketContext";
import { useWebSocketMessage } from "@/components/hooks/useWebSocketMessage";
import { Horse, StreamStatusPayload, HorsesStatsResponse } from "@/types";
import StreamModal from "./StreamModal";
import { useGetActiveStreamStatus } from "../Horses/horseHooks";
import { streamTokenStorage } from "./streamStorage";

interface StreamBtnProps {
  horse: Horse;
  className?: string;
}

export default function StreamBtn({ horse, className = "" }: StreamBtnProps) {
  const queryClient = useQueryClient();
  const { isConnected, sendMessage } = useWebSocket();
  const { activeStream, isFetching } = useGetActiveStreamStatus();

  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(() =>
    streamTokenStorage.get(),
  );

  // Derived state from server
  const isThisHorseActive = activeStream?.horseId === horse.id;

  const isPending = isThisHorseActive && activeStream?.status === "PENDING";

  const isStreaming = isThisHorseActive && activeStream?.status === "STARTED";

  const isIdle = !isThisHorseActive || activeStream === null;

  // Sync token from localStorage on mount/focus
  useEffect(() => {
    const syncToken = () => {
      setToken(streamTokenStorage.get());
    };

    window.addEventListener("focus", syncToken);
    return () => window.removeEventListener("focus", syncToken);
  }, []);

  // Auto-open modal when streaming starts and we have token
  useEffect(() => {
    if (isStreaming && token) {
      setModalOpen(true);
    }
  }, [isStreaming, token]);

  /**
   * Handle stream status from WebSocket
   */
  const handleStreamStatus = useCallback(
    (data: StreamStatusPayload) => {
      if (data.horseId !== horse.id) return;

      console.log(`📡 Stream status for ${horse.name}:`, data);

      if (data.status === "STARTED" && data.streamUrl) {
        // Extract and save token
        const tokenMatch = data.streamUrl.match(/\/stream\/(.+)/);
        const extractedToken = tokenMatch?.[1];

        if (extractedToken) {
          streamTokenStorage.set(extractedToken);
          setToken(extractedToken);
        }

        // Update cache
        queryClient.setQueryData<HorsesStatsResponse>(
          ["horses-stats"],
          (oldData) => {
            if (!oldData) {
              return {
                activeFeedings: [],
                activeStream: { horseId: data.horseId, status: "STARTED" },
              };
            }
            return {
              ...oldData,
              activeStream: { horseId: data.horseId, status: "STARTED" },
            };
          },
        );

        toast.success(`📡 Stream started for ${horse.name}`);
      }

      if (data.status === "STREAM_STOPPED") {
        // Clear token
        streamTokenStorage.clear();
        setToken(null);

        // Update cache
        queryClient.setQueryData<HorsesStatsResponse>(
          ["horses-stats"],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              activeStream: null,
            };
          },
        );

        setModalOpen(false);
        toast("📴 Stream stopped", { icon: "📴" });
      }
    },
    [horse.id, horse.name, queryClient],
  );

  useWebSocketMessage("STREAM_STATUS", handleStreamStatus, [
    handleStreamStatus,
  ]);

  /**
   * Start stream
   */
  const handleStartStream = useCallback(() => {
    if (!isConnected) {
      toast.error("Not connected to server.");
      return;
    }

    if (!horse.camera) {
      toast.error(`${horse.name} has no camera assigned.`);
      return;
    }

    // Optimistically set to PENDING
    queryClient.setQueryData<HorsesStatsResponse>(
      ["horses-stats"],
      (oldData) => {
        if (!oldData) {
          return {
            activeFeedings: [],
            activeStream: { horseId: horse.id, status: "PENDING" },
          };
        }
        return {
          ...oldData,
          activeStream: { horseId: horse.id, status: "PENDING" },
        };
      },
    );

    const success = sendMessage({
      type: "START_STREAM",
      horseId: horse.id,
    });

    if (!success) {
      // Revert on failure
      queryClient.setQueryData<HorsesStatsResponse>(
        ["horses-stats"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            activeStream: null,
          };
        },
      );
      toast.error("Failed to start stream.");
    }
  }, [isConnected, horse, sendMessage, queryClient]);

  /**
   * Stop stream
   */
  const handleStopStream = useCallback(() => {
    sendMessage({
      type: "STOP_STREAM",
      horseId: horse.id,
    });

    // Optimistically clear
    streamTokenStorage.clear();
    setToken(null);

    queryClient.setQueryData<HorsesStatsResponse>(
      ["horses-stats"],
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          activeStream: null,
        };
      },
    );

    setModalOpen(false);
  }, [horse.id, sendMessage, queryClient]);

  // Loading state
  if (isFetching) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg bg-gray-200 text-gray-500 ${className}`}
      >
        <FaSpinner className="animate-spin" />
        <span>LOADING…</span>
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
    if (anotherHorseStreaming)
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    if (!horse.camera) return "bg-gray-300 text-gray-500 cursor-not-allowed";
    return "bg-primary text-primary-foreground hover:bg-primary/90";
  };

  const getButtonTitle = () => {
    if (!horse.camera) return "No camera assigned";
    if (anotherHorseStreaming) return "Another horse is streaming";
    if (isPending) return "Starting stream...";
    return `Start stream for ${horse.name}`;
  };

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        {/* Start Stream Button */}
        {!isStreaming && (
          <button
            onClick={handleStartStream}
            disabled={isDisabled!}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all ${getButtonStyles()}`}
            title={getButtonTitle()}
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>STARTING…</span>
              </>
            ) : (
              <>
                <FaVideo />
                <span>START STREAM</span>
              </>
            )}
          </button>
        )}

        {/* View Stream Button */}
        {isStreaming && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all bg-emerald-500 text-white hover:bg-emerald-600"
          >
            <FaEye />
            <span>VIEW STREAM</span>
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
