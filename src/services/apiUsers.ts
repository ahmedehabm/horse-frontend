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

export async function getUsers(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `/users${query ? `?${query}` : ""}`;

  const data = await apiRequest(url);

  return {
    users: data.data.users,
    count: data.pagination.total,
    totalPages: data.pagination.totalPages,
  };
}
