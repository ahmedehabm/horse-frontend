import { API_BASE } from "@/constants";
import { ApiRequestOptions, FeedingStatusPayload } from "@/types";

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
export async function getActiveFeedingStatus(
  horseId: string,
): Promise<FeedingStatusPayload | null> {
  console.log("status");
  try {
    return await apiRequest<FeedingStatusPayload>(
      `/horses/${horseId}/feeding/active`,
    );
  } catch (error) {
    // No active feeding found
    console.log(`No active feeding for horse ${horseId}`);
    return null;
  }
}
