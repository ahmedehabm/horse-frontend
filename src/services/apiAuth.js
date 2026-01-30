// api/auth.js
import { API_BASE } from "../../constants";

// Helper: Make authenticated request
async function apiRequest(url, options = {}) {
  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${url}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication failed");
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response;
}

// 1. SIGNUP
export async function signup(userData) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Signup failed");
  }

  return response.json();
}

// 2. LOGIN
export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

// 3. GET CURRENT USER (/me)
export async function getCurrentUser() {
  try {
    const response = await apiRequest("/auth/me");
    const data = await response.json();
    return data.data.user;
  } catch (error) {
    if (
      error.message.includes("401") ||
      error.message.includes("Authentication")
    ) {
      return null;
    }
    throw error;
  }
}

// 4. LOGOUT
export async function logout() {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
}

// 5. UPDATE PASSWORD
export async function updatePassword(currentPassword, newPassword) {
  const response = await apiRequest("/auth/updateMyPassword", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
      passwordConfirm: newPassword, // Usually required
    }),
  });

  return response.json();
}
