import { useEffect, useCallback } from "react";
import { useWebSocket } from "../WebSocketContext";

/**
 * Hook to listen for specific Socket.IO events
 * @param {string} eventName - The event name to listen for (e.g., "FEEDING_STATUS")
 * @param {function} callback - Function to call when event is received
 * @param {array} dependencies - Dependencies for the callback
 */
export function useWebSocketMessage(eventName, callback, dependencies = []) {
  const { on } = useWebSocket();

  const memoizedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    // ✅ Use Socket.IO's 'on' method to listen for events
    const cleanup = on(eventName, memoizedCallback);

    // ✅ Cleanup when component unmounts or dependencies change
    return cleanup;
  }, [on, eventName, memoizedCallback]);
}
