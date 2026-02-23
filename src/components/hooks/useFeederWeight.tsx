// src/features/Feeding/useFeederWeight.ts
import { useWebSocketMessage } from "@/components/hooks/useWebSocketMessage";
import { useState, useCallback } from "react";

interface FeederWeightEvent {
  type: "FEEDER_WEIGHT";
  thingName: string;
  weight: string;
}

export function useFeederWeight(thingName: string | undefined) {
  const [weight, setWeight] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const handleWeightUpdate = useCallback(
    (data: FeederWeightEvent) => {
      if (data.thingName !== thingName) return;

      const weightNum = parseFloat(data.weight);
      if (!isNaN(weightNum)) {
        setWeight(weightNum);
        setLastUpdate(Date.now());
      }
    },
    [thingName],
  );

  useWebSocketMessage("FEEDER_WEIGHT", handleWeightUpdate, [
    handleWeightUpdate,
  ]);

  return { weight, lastUpdate };
}
