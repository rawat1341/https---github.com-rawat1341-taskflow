/**
 * API client.
 * Set VITE_API_URL in your .env to switch from mock localStorage mode
 * to your real Express backend.
 * Example: VITE_API_URL=http://localhost:5000/api
 */
export const API_URL = import.meta.env.VITE_API_URL as string | undefined;
export const USE_MOCK = !API_URL;

const TOKEN_KEY = "tm_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export async function http<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = tokenStorage.get();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}
