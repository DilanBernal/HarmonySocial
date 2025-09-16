// import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      signal: ctrl.signal,
      ...options,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} - ${txt || res.statusText}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, b: unknown) =>
    request<T>(p, { method: 'POST', body: JSON.stringify(b) }),
  patch: <T>(p: string, b: unknown) =>
    request<T>(p, { method: 'PATCH', body: JSON.stringify(b) }),
  del: <T>(p: string) => request<T>(p, { method: 'DELETE' }),
};
