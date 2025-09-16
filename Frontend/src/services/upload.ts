import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import { API_BASE, getToken as getStoredToken } from './api';


export async function pickAudio(): Promise<DocumentPickerResponse | null> {
  try {
    const res = await pick({
      type: [types.audio],
      allowMultiSelection: false,
      mode: 'import' as const,
    });
    return Array.isArray(res) ? res[0] : res;
  } catch (e) {
    if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED)
      return null;
    throw e;
  }
}

export async function uploadSongMultipart(params: {
  title: string;
  artist: string;
  genre?: string;
  description?: string;
  duration?: number;
  bpm?: number;
  decade?: number;
  country?: string;
  audio: DocumentPickerResponse;
  token?: string; // opcional: si no viene, se toma del AsyncStorage
  onProgress?: (p: number) => void;
}) {
  const {
    title, artist, genre, description, duration, bpm, decade, country,
    audio, onProgress
  } = params;

  const token = params.token ?? (await getStoredToken());

  const form = new FormData();
  form.append('file', {
    uri: audio.uri,
    name: audio.name ?? `audio-${Date.now()}.mp3`,
    type: audio.type ?? 'audio/mpeg',
  } as any);

 
  form.append("title", title);
  form.append("artist", artist);
  if (genre) form.append("genre", genre);
  if (description) form.append("description", description);
  if (typeof duration === "number") form.append("duration", String(duration));
  if (typeof bpm === "number") form.append("bpm", String(bpm));
  if (typeof decade === "number") form.append("decade", String(decade));
  if (country) form.append("country", country);

  const url = `${API_BASE}/file/song`;

  return await new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

   
    let last = -1;
    const report = (p: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(p)));
      if (clamped !== last && onProgress) {
        last = clamped;
        onProgress(clamped);
      }
    };

    xhr.upload.onloadstart = () => report(0);
    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const pct = (evt.loaded / evt.total) * 100;
      report(Math.min(99, pct));
    };
    xhr.upload.onload = () => report(Math.max(last, 99));

    xhr.onload = () => {
      report(100);
      const text = xhr.responseText || "";
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(text ? JSON.parse(text) : {});
        } catch {
          resolve({});
        }
        try {
          resolve(text ? JSON.parse(text) : {});
        } catch {
          resolve({});
        }
      } else {
        reject(new Error(`HTTP ${xhr.status} - ${text}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.ontimeout = () => reject(new Error("Request timeout"));
    xhr.onabort = () => reject(new Error("Upload aborted"));
    xhr.timeout = 120000;

    if (!token) {
      reject(new Error("No auth token (inicia sesión)"));
      return;
    }

    xhr.open('POST', url);
    if (!token)
      return reject(new Error('No hay token de autenticación (inicia sesión)'));
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(form);
  });
}
