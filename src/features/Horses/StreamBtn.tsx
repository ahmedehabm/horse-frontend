import { useCallback, useState } from "react";
import { FaVideo, FaSpinner, FaEye, FaStop } from "react-icons/fa";
import toast from "react-hot-toast";
import { useWebSocket } from "@/components/WebSocketContext";
import { useWebSocketMessage } from "@/components/hooks/useWebSocketMessage";
import { Horse, StreamStatusPayload } from "@/types";

type StreamStatus = "idle" | "PENDING" | "STREAM_STARTED";

export default function StreamBtn({
  horse,
  className = "",
}: {
  horse: Horse;
  className: string;
}) {
  const { isConnected, sendMessage } = useWebSocket();
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("idle");

  /**
   * ✅ WebSocket listener — authoritative stream state
   */
  const handleStreamStatus = useCallback(
    (data: StreamStatusPayload) => {
      if (data.horseId !== horse.id) return;

      switch (data.status) {
        case "PENDING":
          setStreamStatus("PENDING");
          toast.loading(`Starting stream for ${horse.name}...`, {
            duration: 2000,
          });
          break;

        case "STREAM_STARTED":
          setStreamStatus("STREAM_STARTED");
          toast.success(`📡 Stream started for ${horse.name}`);
          break;

        case "STREAM_STOPPED":
          setStreamStatus("idle");
          toast("📴 Stream stopped");
          break;

        default:
          break;
      }
    },
    [horse.id, horse.name],
  );

  useWebSocketMessage("STREAM_STATUS", handleStreamStatus, [
    handleStreamStatus,
  ]);

  /**
   * ✅ Send START_STREAM
   */
  const handleStartStream = useCallback(() => {
    if (!isConnected) {
      toast.error("Not connected to server.");
      return;
    }

    const success = sendMessage({
      type: "START_STREAM",
      horseId: horse.id,
    });

    if (!success) {
      toast.error("Failed to start stream.");
    }
  }, [isConnected, horse.id, sendMessage]);

  /**
   * ✅ Send STOP_STREAM (optional but clean)
   */
  const handleStopStream = useCallback(() => {
    const success = sendMessage({
      type: "STOP_STREAM",
      horseId: horse.id,
    });

    if (!success) {
      toast.error("Failed to stop stream.");
    }
  }, [horse.id, sendMessage]);

  /**
   * ✅ Placeholder — modal later
   */
  const handleSeeVideo = () => {
    toast("🎥 Video modal coming soon!");
  };

  /**
   * ✅ Button states
   */
  const isPending = streamStatus === "PENDING";
  const isStreaming = streamStatus === "STREAM_STARTED";

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Primary Button */}
      <button
        onClick={isStreaming ? handleStopStream : handleStartStream}
        disabled={!isConnected || isPending}
        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all
          ${
            isPending
              ? "bg-amber-500/90 text-white cursor-wait hover:bg-amber-500/90"
              : isStreaming
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
      >
        {isPending ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>STARTING…</span>
          </>
        ) : isStreaming ? (
          <>
            <FaStop />
            <span>STOP STREAM</span>
          </>
        ) : (
          <>
            <FaVideo />
            <span>START STREAM</span>
          </>
        )}
      </button>

      {/* Secondary Button (only when streaming) */}
      {isStreaming && (
        <button
          onClick={handleSeeVideo}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 shadow transition"
        >
          <FaEye />
          <span>SEE VIDEO</span>
        </button>
      )}
    </div>
  );
}
