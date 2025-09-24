import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { pickAudio, uploadSongMultipart } from '../../core/services/upload';
import { songsService } from '../../core/services/songs';
import { AppConfig } from '../../config/AppConfig';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { AuthUserService } from '../../core/services/user/auth/AuthUserService';
import { useRxSubscriptions } from '../../core/hooks';

const toNumber = (s: string): number | undefined => {
  if (!s?.trim()) return undefined;
  const n = Number(s.trim().replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
};

/**
 * Extrae el blob_name de la URL del archivo subido
 * Maneja diferentes formatos de URL y respuestas del backend
 */
const extractBlobName = (uploadResponse: any): string | null => {
  console.log('[extractBlobName] Processing response:', uploadResponse);

  // 1. Intentar obtener blob_name directamente si existe
  if (uploadResponse?.data?.blob_name || uploadResponse?.data?.blobName) {
    const directBlobName =
      uploadResponse.data.blob_name || uploadResponse.data.blobName;
    console.log('[extractBlobName] Found direct blob_name:', directBlobName);
    return directBlobName;
  }

  // 2. Intentar extraer desde diferentes campos de URL
  const urlCandidates = [
    uploadResponse?.data?.url,
    uploadResponse?.data?.audioUrl,
    uploadResponse?.data?.fileUrl,
    uploadResponse?.url,
    uploadResponse?.blobUrl,
    uploadResponse?.Location,
    uploadResponse?.location,
  ];

  for (const url of urlCandidates) {
    if (typeof url === 'string' && url.length > 0) {
      console.log('[extractBlobName] Trying to extract from URL:', url);

      // Intentar diferentes patrones comunes
      const patterns = [
        /\/canciones\/(.+?)(?:\?|$)/, // /canciones/blob_name?params
        /\/files\/(.+?)(?:\?|$)/, // /files/blob_name?params
        /\/uploads\/(.+?)(?:\?|$)/, // /uploads/blob_name?params
        /\/([^\/]+\.(mp3|wav|m4a|flac|ogg))(?:\?|$)/i, // cualquier archivo de audio
        /\/([^\/\?]+)$/, // último segmento sin query params
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          const extracted = match[1];
          console.log('[extractBlobName] Extracted blob_name:', extracted);
          return extracted;
        }
      }
    }
  }

  console.error('[extractBlobName] Could not extract blob_name from response');
  return null;
};

export default function UploadSongScreen() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [durationStr, setDurationStr] = useState(''); // numeric input as string
  const [bpmStr, setBpmStr] = useState('');
  const [decadeStr, setDecadeStr] = useState('');
  const [country, setCountry] = useState('');

  const [audioName, setAudioName] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<DocumentPickerResponse | null>(
    null,
  );
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Hook para manejar subscripciones de RxJS
  const { addSubscription } = useRxSubscriptions();

  const handlePick = async () => {
    const f = await pickAudio();
    if (!f) return;
    setAudioFile(f);
    setAudioName(f.name ?? 'audio');
  };

  const authService = new AuthUserService();

  const checkConnectivity = async () => {
    try {
      const url = AppConfig.apiBaseUrl.replace(/\/$/, '') + '/ping';
      console.log('[connectivity] HEAD ->', url);
      const res = await fetch(url, { method: 'HEAD' });
      console.log('[connectivity] status', res.status);
      Alert.alert('Conectividad', `HEAD status: ${res.status}`);
    } catch (err) {
      console.error('[connectivity] error', err);
      Alert.alert('Conectividad', `Error: ${String(err)}`);
    }
  };

  const handleUpload = async () => {
    if (!audioFile)
      return Alert.alert('Falta el audio', 'Selecciona un archivo.');
    if (!title.trim() || !artist.trim())
      return Alert.alert('Campos obligatorios', 'Título y artista.');

    try {
      const tokenSubscription = authService.getToken().subscribe({
        next: tok => {
          if (!tok)
            return Alert.alert('Error', 'No auth token (inicia sesión)');

          // Continuar con el upload una vez que tenemos el token
          executeUpload(tok);
        },
        error: error => {
          console.error('Error getting token:', error);
          Alert.alert('Error', 'No se pudo obtener el token');
        },
      });

      addSubscription(tokenSubscription);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Ocurrió un error durante la subida');
      setLoading(false);
    }
  };

  const executeUpload = (tok: string) => {
    try {
      setLoading(true);
      setProgress(0);

      // Parsear numéricos (opcionalmente vacíos)
      const duration = toNumber(durationStr);
      const bpm = toNumber(bpmStr);
      const decade = toNumber(decadeStr);

      // 1) subir blob con metadata opcional usando RxJS
      const uploadSubscription = uploadSongMultipart({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre.trim() || undefined,
        description: description.trim() || undefined,
        duration,
        bpm,
        decade,
        country: country.trim() || undefined,
        audio: audioFile!, // Ya validamos que no sea null al inicio
        token: tok,
        onProgress: setProgress,
      }).subscribe({
        next: up => {
          // Log para ver la forma exacta que devuelve tu backend
          console.log('[uploadSongMultipart] response:', up);

          // Intentar extraer la URL desde varias claves comunes
          const audioUrlCandidates = [
            up?.data?.url,
            up?.data?.audioUrl,
            up?.data?.fileUrl,
            up?.url,
            up?.blobUrl,
            up?.Location, // algunos backends estilo S3
          ];
          console.log(audioUrlCandidates);

          // Extraer blob_name de la respuesta usando función robusta
          const blobName = extractBlobName(up);

          if (!blobName) {
            const backendMsg =
              (up && (up.message || up.error?.message)) ||
              'No se pudo extraer el blob_name del archivo subido';
            throw new Error(String(backendMsg));
          }

          console.log('[Upload] Extracted blob_name:', blobName);

          // 2) crear registro en DB usando RxJS
          const createSongSubscription = songsService
            .createSong({
              title: title.trim(),
              artist: artist.trim(),
              description: description.trim() || null,
              audioUrl: blobName, // Usar blob_name directamente
              duration: typeof duration === 'number' ? duration : null,
              bpm: typeof bpm === 'number' ? bpm : null,
              decade: typeof decade === 'number' ? decade : null,
              country: country.trim() || null,
              genre: genre.trim() || null,
            })
            .subscribe({
              next: response => {
                console.log('[createSong] response:', response);
                Alert.alert('Listo', 'Canción subida.');

                // Reset form
                setTitle('');
                setArtist('');
                setGenre('');
                setDescription('');
                setDurationStr('');
                setBpmStr('');
                setDecadeStr('');
                setCountry('');
                setAudioFile(null);
                setAudioName(null);
                setProgress(0);
                setLoading(false);
              },
              error: error => {
                console.error('[createSong] error:', error);
                const message =
                  error?.message ||
                  'Error al crear la canción en la base de datos';
                Alert.alert('Error', message);
                setLoading(false);
              },
            });

          // Agregar subscripción para cleanup automático
          addSubscription(createSongSubscription);
        },
        error: error => {
          console.error('[uploadSongMultipart] error:', error);
          const message = error?.message || 'No se pudo subir el archivo';
          Alert.alert('Error', message);
          setLoading(false);
        },
      });

      // Agregar subscripción para cleanup automático
      addSubscription(uploadSubscription);
    } catch (e: unknown) {
      const message =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message?: unknown }).message)
          : 'No se pudo subir';
      Alert.alert('Error', message);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        gap: 12,
        top: 35,
        backgroundColor: '#0b0c16',
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: 12,
        }}
      >
        Subir canción
      </Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: '#4f46e5',
          borderRadius: 8,
          padding: 12,
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <TextInput
        placeholder="Artista"
        value={artist}
        onChangeText={setArtist}
        style={{
          borderWidth: 1,
          borderColor: '#4f46e5',
          borderRadius: 8,
          padding: 12,
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <TextInput
        placeholder="Género"
        value={genre}
        onChangeText={setGenre}
        style={{
          borderWidth: 1,
          borderColor: '#374151',
          borderRadius: 8,
          padding: 12,
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#4f46e5',
          borderRadius: 8,
          padding: 12,
          minHeight: 80,
          textAlignVertical: 'top',
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <TextInput
        placeholder="Duración en segundos"
        value={durationStr}
        onChangeText={setDurationStr}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#4f46e5',
          borderRadius: 8,
          padding: 12,
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <TextInput
        placeholder="BPM"
        value={bpmStr}
        onChangeText={setBpmStr}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#4f46e5',
          borderRadius: 8,
          padding: 12,
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <TextInput
        placeholder="Década (ej. 1990)"
        value={decadeStr}
        onChangeText={setDecadeStr}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#4f46e5',
          borderRadius: 8,
          padding: 12,
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <TextInput
        placeholder="País"
        value={country}
        onChangeText={setCountry}
        style={{
          borderWidth: 1,
          borderColor: '#4f46e5',
          borderRadius: 8,
          padding: 12,
          color: '#ffffff',
          backgroundColor: '#1c1e29',
        }}
        placeholderTextColor="#9ca3af"
      />

      <Pressable
        onPress={handlePick}
        style={{
          backgroundColor: '#27272a',
          borderRadius: 8,
          padding: 14,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#4f46e5',
        }}
      >
        <Text style={{ color: '#e5e7eb', fontWeight: '500' }}>
          {audioName ? `Archivo: ${audioName}` : 'Elegir archivo de audio'}
        </Text>
      </Pressable>

      {loading ? (
        <View style={{ gap: 8 }}>
          <ActivityIndicator color="#4f46e5" />
          <Text style={{ color: '#ffffff' }}>Subiendo... {progress}%</Text>
          <View
            style={{ height: 8, backgroundColor: '#374151', borderRadius: 4 }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#4f46e5',
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      ) : (
        <>
          <Pressable
            onPress={checkConnectivity}
            style={{
              backgroundColor: '#1f2937',
              borderRadius: 8,
              padding: 10,
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ color: 'white' }}>Probar conectividad (HEAD)</Text>
          </Pressable>

          <Pressable
            onPress={handleUpload}
            style={{
              backgroundColor: '#4f46e5',
              borderRadius: 8,
              padding: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Subir</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
