import { useState, useCallback, useRef, useEffect } from "react";
import { FaUtensils } from "react-icons/fa";
import toast from "react-hot-toast";
import { useWebSocketMessage } from "../../components/hooks/useWebSocketMessage";
import { useWebSocket } from "../../components/WebSocketContext";

export default function FeedNowBtn({ horse, className = "" }) {
  const { isConnected, sendMessage } = useWebSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [feedAmount] = useState(2.5);
  const timeoutRef = useRef(null);

  const handleFeedingStatus = useCallback(
    (data) => {
      // Check if this message is for our horse
      if (data.horseId !== horse.id) return;

      console.log(`✅ Feeding status for ${horse.name}:`, data);

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Stop loading state
      setIsLoading(false);

      // Show toast based on status
      switch (data.status) {
        case "ACCEPTED":
          toast.success(
            `✅ Feeding ${horse.name} accepted!\nDevice: ${data.deviceName}`,
            { duration: 4000 },
          );
          break;

        case "STARTED":
          toast.success(
            `✅ Feeding ${horse.name} started\nDevice: ${data.deviceName}`,
            { duration: 4000 },
          );
          break;
        case "RUNNING":
          toast.success(
            `✅ Feeding ${horse.name} running !\nDevice: ${data.deviceName}`,
            { duration: 4000 },
          );
          break;

        case "COMPLETED":
          toast.success(`🎉 Feeding ${horse.name} completed!`, {
            duration: 4000,
          });
          break;

        case "FAILED":
          toast.error(`❌ Feeding ${horse.name} failed. Please try again.`, {
            duration: 4000,
          });
          break;

        default:
          toast(`Status: ${data.status}`, { icon: "ℹ️" });
      }
    },
    [horse.id, horse.name],
  );

  // ✅ Listen for FEEDING_STATUS messages (now works with Socket.IO)
  useWebSocketMessage("FEEDING_STATUS", handleFeedingStatus, [
    handleFeedingStatus,
  ]);

  const handleFeedNow = useCallback(() => {
    // Validation: Check connection
    if (!isConnected) {
      toast.error("Not connected to server. Please wait...");
      return;
    }

    // Validation: Check if horse has a feeder
    if (!horse.feeder) {
      toast.error(`${horse.name} has no feeder assigned.`);
      return;
    }

    // Set loading state
    setIsLoading(true);

    // ✅ BACKWARD COMPATIBLE: Works with old format
    const message = {
      type: "FEED_NOW",
      horseId: horse.id,
      amountKg: feedAmount,
    };

    const success = sendMessage(message);

    if (success) {
      console.log(`✅ FEED_NOW sent for ${horse.name}:`, message);
      toast.loading(`Sending feed command for ${horse.name}...`, {
        duration: 2000,
      });

      // Timeout fallback
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        toast.error("No response from server. Please try again.");
      }, 10000);
    } else {
      toast.error("Failed to send feed command. Please try again.");
      setIsLoading(false);
    }
  }, [isConnected, horse, feedAmount, sendMessage]);

  // 🔧 Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Button state
  const isDisabled = !isConnected || isLoading || !horse.feeder;

  // Button styles
  const getButtonStyles = () => {
    if (isLoading) {
      return "bg-yellow-500 text-white cursor-wait hover:bg-yellow-500";
    }
    if (!isConnected || !horse.feeder) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300";
    }
    return "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-xl hover:from-emerald-600 hover:to-green-700";
  };

  return (
    <button
      onClick={handleFeedNow}
      disabled={isDisabled}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm ${getButtonStyles()} ${className}`}
      title={
        !isConnected
          ? "Not connected to server"
          : !horse.feeder
            ? "No feeder assigned to this horse"
            : `Feed ${horse.name} with ${feedAmount}kg`
      }
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>FEEDING...</span>
        </>
      ) : (
        <>
          <FaUtensils className="text-sm" />
          <span>FEED NOW</span>
        </>
      )}
    </button>
  );
}
