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
  console.log("SSSSTTTAAATS");
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

// export async function createHorse(formData: any) {
//   console.log(formData);
//   const response = await apiRequest("/horses", {
//     method: "POST",
//     body: JSON.stringify(formData),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || "Failed to create horse");
//   }

//   return response.json();
// }

export async function createHorse(payload: {
  name: string;
  breed: string;
  age: number;
  location: string;
  ownerId: string;
  feederId?: string;
  cameraId?: string;
  image?: string; // will be a file
}) {
  console.log(JSON.stringify(payload));
  return apiRequest("/horses", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
