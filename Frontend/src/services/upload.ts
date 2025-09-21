import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import { API_BASE } from './api';
import { AuthUserService } from '../core/services/user/auth/AuthUserService';

const authService = new AuthUserService();

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
  token?: string;
  onProgress?: (p: number) => void;
}) {
  const {
    title,
    artist,
    genre,
    description,
    duration,
    bpm,
    decade,
    country,
    audio,
    onProgress,
  } = params;

  const token = params.token ?? (await authService.getToken());

  const form = new FormData();
  form.append('file', {
    uri: audio.uri,
    name: audio.name ?? `audio-${Date.now()}.mp3`,
    type: audio.type ?? 'audio/mpeg',
  } as any);

  form.append('title', title);
  form.append('artist', artist);
  if (genre) form.append('genre', genre);
  if (description) form.append('description', description);
  if (typeof duration === 'number') form.append('duration', String(duration));
  if (typeof bpm === 'number') form.append('bpm', String(bpm));
  if (typeof decade === 'number') form.append('decade', String(decade));
  if (country) form.append('country', country);

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
    xhr.upload.onprogress = evt => {
      if (!evt.lengthComputable) return;
      const pct = (evt.loaded / evt.total) * 100;
      report(Math.min(99, pct));
    };
    xhr.upload.onload = () => report(Math.max(last, 99));

    xhr.onload = () => {
      report(100);
      const status = xhr.status;
      const text = xhr.responseText || '';

      if (status >= 200 && status < 300) {
        let parsed: any = {};
        try {
          parsed = text ? JSON.parse(text) : {};
        } catch {
          const trimmed = text.trim();
          if (/^https?:\/\//i.test(trimmed)) {
            parsed = { url: trimmed };
          }
        }

        const fromBody =
          parsed?.data?.url ??
          parsed?.data?.audioUrl ??
          parsed?.url ??
          parsed?.audioUrl ??
          parsed?.Location ??
          parsed?.location;

        const fromHeader =
          xhr.getResponseHeader('Location') ||
          xhr.getResponseHeader('location') ||
          xhr.getResponseHeader('X-File-URL') ||
          xhr.getResponseHeader('x-file-url') ||
          xhr.getResponseHeader('X-Resource-Location') ||
          undefined;

        const finalUrl = fromBody || fromHeader || null;

        resolve({
          ...parsed,
          url: finalUrl, 
          headers: { location: fromHeader || null },
          raw: text,
          status,
        });
      } else {
        reject(new Error(`HTTP ${status} - ${text}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.ontimeout = () => reject(new Error('Request timeout'));
    xhr.onabort = () => reject(new Error('Upload aborted'));
    xhr.timeout = 120000;

    if (!token) {
      reject(new Error('No auth token (inicia sesión)'));
      return;
    }

    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(form);
  });
}
