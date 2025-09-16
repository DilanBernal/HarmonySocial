import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import { API_BASE, getToken as getStoredToken } from './api';

/** Abre el selector de AUDIO (mp3, wav, etc.) y devuelve un único archivo o null si se canceló */
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

/** Sube el audio + metadatos en multipart a POST /api/file/song (campo "file") */
export async function uploadSongMultipart(params: {
  title: string;
  artist: string;
  genre?: string;
  audio: DocumentPickerResponse;
  token?: string; // opcional: si no viene, se toma del AsyncStorage
  onProgress?: (p: number) => void;
}) {
  const { title, artist, genre, audio, onProgress } = params;

  // Usa el token pasado o, si no, el guardado en AsyncStorage
  const token = params.token ?? (await getStoredToken());

  // Construye el multipart/form-data
  const form = new FormData();
  form.append('file', {
    uri: audio.uri,
    name: audio.name ?? `audio-${Date.now()}.mp3`,
    type: audio.type ?? 'audio/mpeg',
  } as any);
  form.append('title', title);
  form.append('artist', artist);
  if (genre) form.append('genre', genre);

  const url = `${API_BASE}/file/song`;
  const xhr = new XMLHttpRequest();

  return await new Promise<any>((resolve, reject) => {
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = evt => {
        if (evt.lengthComputable)
          onProgress(Math.round((evt.loaded * 100) / evt.total));
      };
    }

    xhr.onload = () => {
      const text = xhr.responseText || '';
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(text ? JSON.parse(text) : {});
        } catch {
          resolve({});
        }
      } else {
        reject(new Error(`HTTP ${xhr.status} - ${text}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));

    xhr.open('POST', url);
    if (!token)
      return reject(new Error('No hay token de autenticación (inicia sesión)'));
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(form);
  });
}
