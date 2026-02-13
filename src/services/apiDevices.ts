import { API_BASE } from "@/constants";
import { ApiRequestOptions } from "@/types";

export async function apiRequest<T = any>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const config: RequestInit = {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${url}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(error);
    throw new Error((error as any).message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getDeviceOptions(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/devices/options${query ? `?${query}` : ""}`;

  const data = await apiRequest(url);

  return {
    options: data.data.devices,
  };
}
export async function getMyFeeders(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/devices/my/feeders${query ? `?${query}` : ""}`;

  const data = await apiRequest(url);

  return {
    feeders: data.data.feeders,
    count: data.pagination.total,
    totalPages: data.pagination.totalPages,
  };
}

export async function getAdminDevices(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/devices/${query ? `?${query}` : ""}`;

  const data = await apiRequest(url);

  return {
    devices: data.data.devices,
    count: data.pagination.total,
    totalPages: data.pagination.totalPages,
  };
}

export async function createDevice(payload: {
  thingLabel: string;
  deviceType: "CAMERA" | "FEEDER";
  location: string;
  // feeder-specific (optional; only meaningful if deviceType === "FEEDER")
  feederType?: "MANUAL" | "SCHEDULED";
  morningTime?: string;
  dayTime?: string;
  nightTime?: string;
}) {
  return apiRequest("/devices", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
