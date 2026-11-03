import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_AUTH_URL;

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  // Get JWT token
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(error?.message || "Authentication required");
  }

  // Prepare request headers
  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Send authenticated request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "API request failed");
  }

  return result;
};