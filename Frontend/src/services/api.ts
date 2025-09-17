// import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios, { AxiosRequestConfig } from "axios";

// Mantengo tu IP fija (la cambias manualmente cuando sea necesario)
// const HOST = Platform.OS === 'android' ? 'localhost' : 'localhost';
// export const API_BASE = `http://${HOST}:4200/api`;
// export const API_BASE = `http://192.168.1.3:4200/api`;
export const API_BASE = `https://kw389p26-4200.use2.devtunnels.ms/api`;
// export const API_BASE = `${AppConfig.apiBaseUrl}/api`;

/** Intenta recuperar el JWT desde AsyncStorage probando varias claves y formatos. */
export async function getToken(): Promise<string | null> {
  const keys = ['token', 'authToken', 'accessToken', 'jwt', 'userToken'];
  for (const k of keys) {
    const raw = await AsyncStorage.getItem(k);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string') return parsed;
      if (parsed?.token) return String(parsed.token);
      if (parsed?.accessToken) return String(parsed.accessToken);
    } catch {
      return raw; // ya era string plano
    }
  }
  return null;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 10000,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const token = await getToken();

    // No forzar Content-Type si se envía FormData (que agregue el boundary automáticamente)
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };
    if (!isFormData) {
      headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
    }

    const res = await fetch(url, {
      ...options,
      headers,
      signal: ctrl.signal,
    });

    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      // Intentar leer error del backend
      let errMsg = res.statusText;
      try {
        if (contentType.includes('application/json')) {
          const j = await res.json();
          errMsg = j?.message || j?.error || JSON.stringify(j);
        } else {
          errMsg = await res.text();
        }
      } catch {
        // ignorar parsing errors
      }
      throw new Error(`HTTP ${res.status} - ${errMsg || 'Error'}`);
    }

    if (res.status === 204) return undefined as T;

    // Devolver JSON si es JSON; si no, texto
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    const text = await res.text();
    return text as unknown as T;
  } finally {
    clearTimeout(timer);
  }
}

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;
type GetOptions = {
  params?: QueryParams;
  headers?: Record<string, string>;
  timeoutMs?: number;
};

function toQuery(params?: QueryParams): string {
  if (!params) return "";
  const q = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}

export const api = {
  get:  <T>(p: string, opt?: GetOptions) =>
    request<T>(`${p}${toQuery(opt?.params)}`, { headers: opt?.headers }, opt?.timeoutMs),
  post: <T>(p: string, b: unknown) =>
    request<T>(p, { method: "POST", body: JSON.stringify(b) }),
  patch:<T>(p: string, b: unknown) =>
    request<T>(p, { method: "PATCH", body: JSON.stringify(b) }),
  del:  <T>(p: string) => request<T>(p, { method: "DELETE" }),
};
