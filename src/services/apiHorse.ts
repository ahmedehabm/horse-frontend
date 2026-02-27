import { API_BASE } from "@/constants";
import {
  ApiRequestOptions,
  FeedingStatusPayload,
  HorsesStatsResponse,
} from "@/types";

export async function apiRequest<T = any>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const config: RequestInit = {
    method: options.method || "GET",
    credentials: "include",
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // ✅ Fixed - added parentheses
  const response = await fetch(`${API_BASE}${url}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(error);
    throw new Error((error as any).message || `HTTP ${response.status}`);
  }

  //  204 No Content (and 205 Reset Content) have no body
  if (response.status === 204 || response.status === 205) {
    return null as T;
  }

  return response.json() as Promise<T>;
}
// ==============================
// Fetch user's horses
// ==============================
export async function getMyHorses(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/horses/me${query ? `?${query}` : ""}`;

  const data = await apiRequest(url);

  return {
    horses: data.data.horses,
    count: data.pagination.total,
    totalPages: data.pagination.totalPages,
  };
}

export async function getAllHorses(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/horses/${query ? `?${query}` : ""}`;

  const data = await apiRequest(url);

  return {
    horses: data.data.horses,
    count: data.pagination.total,
    totalPages: data.pagination.totalPages,
  };
}

/**
 * Get the current/active feeding status for a horse
 * Returns null if no active feeding in progress
 */

export async function getHorsesStats() {
  try {
    const response = await apiRequest<{
      status: string;
      data: HorsesStatsResponse;
    }>(`/horses/stats`);
    return response.data;
  } catch (error) {
    console.log("Failed to fetch horses stats:", error);
    // Return empty state on error
    return {
      activeFeedings: [],
      activeStream: null,
    };
  }
}

export async function createHorse(payload: {
  name: string;
  breed: string;
  age: number;
  location: string;
  ownerId: string;
  feederId?: string;
  cameraId?: string;
  image?: File;
}) {
  const formData = new FormData();

  // Append all text fields
  formData.append("name", payload.name);
  formData.append("breed", payload.breed);
  formData.append("age", String(payload.age));
  formData.append("location", payload.location);
  formData.append("ownerId", payload.ownerId);

  if (payload.feederId) formData.append("feederId", payload.feederId);
  if (payload.cameraId) formData.append("cameraId", payload.cameraId);

  // Append file if exists
  if (payload.image) formData.append("image", payload.image);

  return apiRequest("/horses", {
    method: "POST",
    body: formData,
  });
}

export async function getHorse(id: string) {
  const data = await apiRequest(`/horses/${id}`);
  return {
    horse: data.data.horse,
  };
}

export async function updateHorse(
  id: string,
  payload: {
    name: string;
    breed: string;
    age: number;
    location: string;
    feederId?: string;
    cameraId?: string;
    image?: File;
  },
) {
  const formData = new FormData();

  // Append all text fields
  formData.append("name", payload.name);
  formData.append("breed", payload.breed);
  formData.append("age", String(payload.age));
  formData.append("location", payload.location);

  if (payload.feederId) formData.append("feederId", payload.feederId);
  if (payload.cameraId) formData.append("cameraId", payload.cameraId);

  // Append file if exists
  if (payload.image) formData.append("image", payload.image);

  return apiRequest(`/horses/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteHorse(id: string, deleteDevices: boolean) {
  const url = `/horses/${id}?deleteDevices=${deleteDevices}`;

  return apiRequest(url, {
    method: "DELETE",
  });
}
