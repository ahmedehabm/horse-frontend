import { useWebSocketMessage } from "@/components/hooks/useWebSocketMessage";
import { useState, useEffect, useCallback } from "react";
import { FaWeight } from "react-icons/fa";

interface FeederWeightEvent {
  type: "FEEDER_WEIGHT";
  thingName: string;
  weight: string;
}

interface FeederWeightProps {
  thingName: string | undefined;
  className?: string;
}

export default function FeederWeight({
  thingName,
  className = "",
}: FeederWeightProps) {
  const [weight, setWeight] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Handle incoming weight events
  const handleWeightUpdate = useCallback(
    (data: FeederWeightEvent) => {
      // Only update if this event is for our feeder
      if (data.thingName !== thingName) return;

      setWeight(data.weight);
      setLastUpdate(Date.now());
      setIsLive(true);
    },
    [thingName],
  );

  // Listen for FEEDER_WEIGHT events
  useWebSocketMessage("FEEDER_WEIGHT", handleWeightUpdate, [
    handleWeightUpdate,
  ]);

  // Reset live indicator after 5 seconds of no updates
  useEffect(() => {
    if (!lastUpdate) return;

    const timeout = setTimeout(() => {
      setIsLive(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [lastUpdate]);

  // Don't render if no feeder assigned
  if (!thingName) {
    return (
      <div
        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm 
                    bg-gray-100 text-gray-400 ${className}`}
      >
        <FaWeight className="mr-2" />
        <span>No feeder</span>
      </div>
    );
  }

  // Waiting for first data
  if (weight === null) {
    return (
      <div
        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm 
                    bg-gray-100 text-gray-500 ${className}`}
      >
        <FaWeight className="mr-2 animate-pulse" />
        <span>Connecting...</span>
      </div>
    );
  }

  // Parse weight for display
  const weightNum = parseFloat(weight);
  const displayWeight = isNaN(weightNum) ? weight : weightNum.toFixed(2);

  // Determine color based on weight
  const getWeightColor = (w: number): string => {
    if (isNaN(w)) return "bg-gray-100 text-gray-700";
    if (w <= 0) return "bg-red-50 text-red-700 border-red-200";
    if (w < 1) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm 
                  border transition-all duration-300 ${getWeightColor(weightNum)} ${className}`}
    >
      {/* Live indicator */}
      <div className="relative mr-2">
        <FaWeight className="text-current" />
        {isLive && (
          <span
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 
                       animate-ping"
          />
        )}
      </div>

      {/* Weight value */}
      <span className="font-semibold">{displayWeight}</span>
      <span className="ml-1 text-xs opacity-75">kg</span>
    </div>
  );
}
