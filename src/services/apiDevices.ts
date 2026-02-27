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
    throw new Error((error as any).message || `HTTP ${response.status}`);
  }

  //  204 No Content (and 205 Reset Content) have no body
  if (response.status === 204 || response.status === 205) {
    return null as T;
  }

  //  If server didn't send JSON, don't try to parse it
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return (await response.text()) as unknown as T;
  }

  return (await response.json()) as T;
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

export async function getMyFeeder(id: string) {
  const data = await apiRequest(`/devices/my/feeders/${id}`);

  return {
    feeder: data.data.feeder,
  };
}

export async function updateMyFeeder(
  id: string,
  payload: {
    feederType: "MANUAL" | "SCHEDULED";
    scheduledAmountKg?: number;
    morningTime?: string;
    dayTime?: string;
    nightTime?: string;
  },
) {
  return apiRequest(`/devices/my/feeders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
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

export async function getDevice(id: string) {
  const data = await apiRequest(`/devices/${id}`);
  return {
    device: data.data.device,
  };
}

export async function updateDevice(
  id: string,
  payload: {
    thingLabel: string;
    location: string;

    // feeder-specific
    feederType?: "MANUAL" | "SCHEDULED";
    morningTime?: string;
    dayTime?: string;
    nightTime?: string;
  },
) {
  return apiRequest(`/devices/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function deleteDevice(id: string) {
  return apiRequest(`/devices/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function forceUnassign(id: string) {
  return apiRequest(`/devices/unassign/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
