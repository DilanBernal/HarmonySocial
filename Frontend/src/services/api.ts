import { Platform, } from "react-native";

const HOST = Platform.OS === "android" ? "localhost" : "localhost";
// export const API_BASE = `http://${HOST}:4200/api`;
export const API_BASE = `http://192.168.1.3:4200/api`;



async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 10000): Promise<T> {
  const url = `${API_BASE}${path}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      signal: ctrl.signal,
      ...options,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${txt || res.statusText}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get:  <T>(p: string) => request<T>(p),
  post: <T>(p: string, b: unknown) => request<T>(p, { method: "POST", body: JSON.stringify(b) }),
  patch:<T>(p: string, b: unknown) => request<T>(p, { method: "PATCH", body: JSON.stringify(b) }),
  del:  <T>(p: string) => request<T>(p, { method: "DELETE" }),
};
