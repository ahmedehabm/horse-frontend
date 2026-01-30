import { API_BASE } from "../../constants";

async function apiRequest(url, options = {}) {
  const config = {
    method: options.method || "GET", // Default to GET if no method specified
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
    console.log(error);
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json(); // Return the parsed JSON directly
}

export async function getMyHorses(params = {}) {
  console.warn("s");
  const query = new URLSearchParams(params).toString();
  const url = `/horses/me${query ? `?${query}` : ""}`;

  const data = await apiRequest(url); // Already parsed JSON

  return {
    horses: data.data.horses,
    count: data.pagination.total,
    totalPages: data.pagination.totalPages,
  };
}
