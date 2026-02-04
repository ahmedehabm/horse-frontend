import { useEffect, useCallback, DependencyList } from "react";
import { ServerToClientEvents, useWebSocket } from "../WebSocketContext";

/**
 * Hook to listen for specific Socket.IO events
 * @param eventName - The event name to listen for (e.g., "FEEDING_STATUS")
 * @param callback - Function to call when event is received
 * @param dependencies - Dependencies for the callback
 */
export function useWebSocketMessage<K extends keyof ServerToClientEvents>(
  eventName: K,
  callback: ServerToClientEvents[K],
  dependencies: DependencyList = [],
): void {
  const { on } = useWebSocket();

  const memoizedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    // ✅ Use Socket.IO's 'on' method to listen for events
    const cleanup = on(eventName, memoizedCallback);

    // ✅ Cleanup when component unmounts or dependencies change
    return cleanup;
  }, [on, eventName, memoizedCallback]);
}
