import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { io } from "socket.io-client";

const SocketIOContext = createContext(null);

const SOCKET_URL = "http://localhost:3000";

export function SocketIOProvider({ children }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const isMountedRef = useRef(false);

  const connect = useCallback(() => {
    // Guard: Already have a socket instance
    if (socketRef.current) {
      console.log("✅ Socket already exists, skipping...");
      return;
    }

    try {
      console.log("🔌 Connecting to Socket.IO:", SOCKET_URL);

      // ✅ Create Socket.IO client with auto-reconnection
      const socket = io(SOCKET_URL, {
        // Auto-reconnection settings (client-side)
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,

        // Transport settings
        transports: ["websocket", "polling"],

        // Authentication (cookies are sent automatically)
        withCredentials: true,

        // Timeout settings
        timeout: 20000,
      });

      socketRef.current = socket;

      // ✅ Connection successful
      socket.on("connect", () => {
        console.log("✅ Socket.IO connected! Socket ID:", socket.id);
        setIsConnected(true);
        setConnectionError(null);
      });

      // ✅ Authentication success event (from your backend)
      socket.on("AUTH_SUCCESS", (data) => {
        console.log("✅ Authentication successful:", data);
      });

      // ✅ Connection error
      socket.on("connect_error", (error) => {
        console.error("❌ Socket.IO connection error:", error.message);
        setConnectionError(`Connection error: ${error.message}`);
        setIsConnected(false);
      });

      // ✅ Disconnection
      socket.on("disconnect", (reason) => {
        console.log("❌ Socket.IO disconnected:", reason);
        setIsConnected(false);

        // Handle different disconnect reasons
        if (reason === "io server disconnect") {
          console.log("⚠️ Server disconnected the client");
          setConnectionError("Server disconnected the connection");
        } else if (reason === "io client disconnect") {
          console.log("✅ Client disconnected manually");
        } else {
          console.log("🔄 Will attempt to reconnect...");
        }
      });

      // ✅ Reconnection attempt
      socket.io.on("reconnect_attempt", (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      });

      // ✅ Reconnection failed
      socket.io.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed after all attempts");
        setConnectionError(
          "Failed to reconnect after multiple attempts. Please refresh the page.",
        );
      });

      // ✅ Successfully reconnected
      socket.io.on("reconnect", (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        setIsConnected(true);
        setConnectionError(null);
      });

      // ✅ Error event from server
      socket.on("ERROR", (error) => {
        console.error("❌ Server error:", error);
        setConnectionError(error.message || "Server error occurred");
      });

      // ✅ Ping/Pong for keep-alive
      socket.on("pong", () => {
        console.log("🏓 Pong received");
      });
    } catch (err) {
      console.error("❌ Error creating Socket.IO connection:", err);
      setConnectionError("Failed to establish connection");
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      console.log("🔌 Cleaning up Socket.IO connection...");
      isMountedRef.current = false;

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  // ✅ BACKWARD COMPATIBLE sendMessage - works like old WebSocket
  const sendMessage = useCallback((messageOrEvent, data) => {
    if (!socketRef.current?.connected) {
      console.error("❌ Socket.IO is not connected");
      return false;
    }

    // ✅ NEW: If two parameters, use as (eventName, data)
    if (data !== undefined) {
      socketRef.current.emit(messageOrEvent, data);
      return true;
    }

    // ✅ OLD: If one parameter (object with type field), extract type and emit
    if (typeof messageOrEvent === "object" && messageOrEvent.type) {
      const { type, ...payload } = messageOrEvent;
      socketRef.current.emit(type, payload);
      return true;
    }

    // Fallback: just emit the message as-is
    console.warn("⚠️ Unexpected sendMessage format:", messageOrEvent);
    return false;
  }, []);

  // ✅ Specific event emitters for your use cases
  const feedNow = useCallback(
    (horseId, amountKg) => {
      return sendMessage("FEED_NOW", { horseId, amountKg });
    },
    [sendMessage],
  );

  const startStream = useCallback(
    (horseId) => {
      return sendMessage("START_STREAM", { horseId });
    },
    [sendMessage],
  );

  // ✅ Generic event listener
  const on = useCallback((eventName, callback) => {
    if (!socketRef.current) return;
    socketRef.current.on(eventName, callback);

    return () => {
      socketRef.current?.off(eventName, callback);
    };
  }, []);

  // ✅ Remove event listener
  const off = useCallback((eventName, callback) => {
    if (!socketRef.current) return;
    socketRef.current.off(eventName, callback);
  }, []);

  // ✅ Listen to specific events
  const onFeedingStatus = useCallback(
    (callback) => {
      return on("FEEDING_STATUS", callback);
    },
    [on],
  );

  const onStreamStatus = useCallback(
    (callback) => {
      return on("STREAM_STATUS", callback);
    },
    [on],
  );

  const onBroadcast = useCallback(
    (callback) => {
      return on("BROADCAST", callback);
    },
    [on],
  );

  // ✅ Manual reconnection
  const reconnect = useCallback(() => {
    console.log("🔄 Manual reconnection triggered...");

    if (socketRef.current) {
      if (socketRef.current.connected) {
        console.log("✅ Already connected");
        return;
      }
      socketRef.current.connect();
    } else {
      connect();
    }
  }, [connect]);

  // ✅ Get socket instance (for advanced usage)
  const getSocket = useCallback(() => socketRef.current, []);

  // ✅ Disconnect manually
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  const value = useMemo(
    () => ({
      // ✅ Same API as WebSocket provider
      isConnected,
      connectionError,
      sendMessage,
      reconnect,
      getSocket,

      // ✅ Additional Socket.IO specific methods
      disconnect,
      on,
      off,

      // ✅ Convenience methods for your specific events
      feedNow,
      startStream,
      onFeedingStatus,
      onStreamStatus,
      onBroadcast,
    }),
    [
      isConnected,
      connectionError,
      sendMessage,
      reconnect,
      getSocket,
      disconnect,
      on,
      off,
      feedNow,
      startStream,
      onFeedingStatus,
      onStreamStatus,
      onBroadcast,
    ],
  );

  return (
    <SocketIOContext.Provider value={value}>
      {children}
    </SocketIOContext.Provider>
  );
}

export function useSocketIO() {
  const context = useContext(SocketIOContext);
  if (!context) {
    throw new Error("useSocketIO must be used within a SocketIOProvider");
  }
  return context;
}

// ✅ Backward compatibility alias
export const useWebSocket = useSocketIO;
export const WebSocketProvider = SocketIOProvider;
