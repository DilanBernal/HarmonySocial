import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { pickAudio, uploadSongMultipart } from '../../services/upload';
import { songsService } from '../../services/songs';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { AuthUserService } from '../../core/services/user/auth/AuthUserService';
import { useRxSubscriptions } from '../../hooks/useRxSubscriptions';

const toNumber = (s: string): number | undefined => {
  if (!s?.trim()) return undefined;
  const n = Number(s.trim().replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
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

  const handleUpload = async () => {
    if (!audioFile)
      return Alert.alert('Falta el audio', 'Selecciona un archivo.');
    if (!title.trim() || !artist.trim())
      return Alert.alert('Campos obligatorios', 'Título y artista.');

    try {
      // Obtener token usando RxJS
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
          const audioUrl = audioUrlCandidates.find(
            v => typeof v === 'string' && v.length > 0,
          ) as string | undefined;

          if (!audioUrl) {
            const backendMsg =
              (up && (up.message || up.error?.message)) ||
              'No se recibió URL del audio';
            throw new Error(String(backendMsg));
          }

          console.log(audioUrl);

          // 2) crear registro en DB usando RxJS
          const createSongSubscription = songsService
            .createSong({
              title: title.trim(),
              artist: artist.trim(),
              description: description.trim() || null,
              audioUrl: audioUrl.split('canciones/')[1],
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
      )}
    </View>
  );
}
