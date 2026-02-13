// ==============================
// Generic fetch wrapper

import { Socket } from "socket.io-client";

// ==============================
export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: "ADMIN" | "USER" | string;
}

export interface Horse {
  id: string;
  name: string;
  lastFeedAt: Date;
  image: string;
  feeder?: {
    id: string;
    feederType: "MANUAL" | "SCHEDULED";
    thingName: string;
  } | null;
  camera?: {
    id: string;
    thingName: string;
  } | null;
}

/*
 * Messages Fronted to => Backend
 */
export interface FeedNowMessage {
  type: "FEED_NOW";
  horseId: string;
  amountKg: number;
}

/*
 * Messages Fronted to => Backend
 */
export interface StartStreamMessage {
  type: "START_STREAM";
  horseId: string;
}

/*
 * Messages Fronted to => Backend
 */
export type ClientMessage = FeedNowMessage | StartStreamMessage;

/*
 * Messages FROM Backend TO Frontend
 */
export type FeedingStatusPayload = {
  horseId: string;
  status: string;
  feedingId: string;
  errorMessage?: string;
};

/*
 * Messages FROM Backend TO Frontend
 */
export type StreamStatusPayload = {
  horseId: string;
  status: string;
  streamUrl: string;
  errorMessage?: string;
};

export interface FeederWeightEvent {
  type: "FEEDER_WEIGHT";
  thingName: string;
  weight: string;
}

/*
 * Messages FROM Backend TO Frontend
 */
export type BroadcastPayload =
  | ({ type: "FEEDING_STATUS" } & FeedingStatusPayload)
  | ({ type: "STREAM_STATUS" } & StreamStatusPayload);

//  Socket.IO Event Types
export interface ServerToClientEvents {
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
  AUTH_SUCCESS: (data: { userId: string; message: string }) => void;
  ERROR: (error: { message: string; code?: string }) => void;
  pong: () => void;
  FEEDING_STATUS: (data: FeedingStatusPayload) => void;
  STREAM_STATUS: (data: StreamStatusPayload) => void;
  FEEDER_WEIGHT: (data: FeederWeightEvent) => void;
}

export interface ClientToServerEvents {
  FEED_NOW: (data: { horseId: string; amountKg: number }) => void;
  START_STREAM: (data: { horseId: string }) => void;
  ping: () => void;
  [key: string]: (data?: any) => void;
}

//  Typed Socket.IO client
export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

//  Context value type
export interface SocketIOContextValue {
  isConnected: boolean;
  connectionError: string | null;
  sendMessage: {
    (event: string, data: any): boolean;
    (message: { type: string; [key: string]: any }): boolean;
  };
  reconnect: () => void;
  getSocket: () => TypedSocket | null;
  disconnect: () => void;
  on: <K extends keyof ServerToClientEvents>(
    eventName: K,
    callback: ServerToClientEvents[K],
  ) => (() => void) | undefined;
  off: <K extends keyof ServerToClientEvents>(
    eventName: K,
    callback: ServerToClientEvents[K],
  ) => void;
}

export interface ActiveFeedingStats {
  horseId: string;
  feedingId: string;
  status: string;
}

export interface ActiveStreamStats {
  horseId: string;
  status: "STARTED" | "PENDING" | "IDLE";
}

export interface HorsesStatsResponse {
  activeFeedings: ActiveFeedingStats[];
  activeStream: ActiveStreamStats | null;
}
