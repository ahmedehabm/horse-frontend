import { SOCKET_URL } from "@/constants";
import {
  ServerToClientEvents,
  SocketIOContextValue,
  TypedSocket,
  ClientToServerEvents,
} from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SocketIOContext = createContext<SocketIOContextValue | null>(null);

export function SocketIOProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<TypedSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(false);

  const connect = useCallback(() => {
    // Guard: Already have a socket instance
    if (socketRef.current) {
      console.log("✅ Socket already exists, skipping...");
      return;
    }

    try {
      console.log("🔌 Connecting to Socket.IO:", SOCKET_URL);

      // ✅ Create Socket.IO client with auto-reconnection
      const socket: TypedSocket = io(SOCKET_URL, {
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

      //  Connection successful
      socket.on("connect", () => {
        console.log("✅");
        setIsConnected(true);
        setConnectionError(null);
      });

      // Authentication success event (from your backend)
      socket.on("AUTH_SUCCESS", (data) => {
        console.log("✅");
      });

      //  Connection error
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
        toast.error(error.message);
        setConnectionError(error.message || "Server error occurred");
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

  // BACKWARD COMPATIBLE sendMessage - works like old WebSocket
  const sendMessage = useCallback(
    (
      messageOrEvent: string | { type: string; [key: string]: any },
      data?: any,
    ): boolean => {
      if (!socketRef.current?.connected) {
        console.error("❌ Socket.IO is not connected");
        return false;
      }

      if (data !== undefined) {
        socketRef.current.emit(messageOrEvent as string, data);
        return true;
      }

      if (typeof messageOrEvent === "object" && messageOrEvent.type) {
        const { type, ...payload } = messageOrEvent;
        socketRef.current.emit(type, payload);
        return true;
      }
      return false;
    },
    [],
  );

  // ✅ Generic event listener
  const on = useCallback(
    <K extends keyof ServerToClientEvents>(
      eventName: K,
      callback: ServerToClientEvents[K],
    ): (() => void) | undefined => {
      if (!socketRef.current) return;
      socketRef.current.on(eventName as any, callback as any);

      return () => {
        socketRef.current?.off(eventName as any, callback as any);
      };
    },
    [],
  );

  const off = useCallback(
    <K extends keyof ServerToClientEvents>(
      eventName: K,
      callback: ServerToClientEvents[K],
    ): void => {
      if (!socketRef.current) return;
      socketRef.current.off(eventName as any, callback as any);
    },
    [],
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
  const getSocket = useCallback(
    (): TypedSocket | null => socketRef.current,
    [],
  );

  // ✅ Disconnect manually
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  const value = useMemo<SocketIOContextValue>(
    () => ({
      isConnected,
      connectionError,
      sendMessage,
      reconnect,
      getSocket,
      disconnect,
      on,
      off,
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
    ],
  );

  return (
    <SocketIOContext.Provider value={value}>
      {children}
    </SocketIOContext.Provider>
  );
}

export function useSocketIO(): SocketIOContextValue {
  const context = useContext(SocketIOContext);
  if (!context) {
    throw new Error("useSocketIO must be used within a SocketIOProvider");
  }
  return context;
}

// ✅ Backward compatibility alias
export const useWebSocket = useSocketIO;
export const WebSocketProvider = SocketIOProvider;

// ✅ Export types for consumers
export type {
  ServerToClientEvents,
  ClientToServerEvents,
  TypedSocket,
  SocketIOContextValue,
};
