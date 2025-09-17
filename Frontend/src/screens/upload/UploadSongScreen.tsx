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
import { api, getToken } from '../../services/api';
import type { DocumentPickerResponse } from '@react-native-documents/picker';

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
  const [audioFile, setAudioFile] = useState<DocumentPickerResponse | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handlePick = async () => {
    const f = await pickAudio();
    if (!f) return;
    setAudioFile(f);
    setAudioName(f.name ?? 'audio');
  };

  const handleUpload = async () => {
    if (!audioFile)
      return Alert.alert('Falta el audio', 'Selecciona un archivo.');
    if (!title.trim() || !artist.trim())
      return Alert.alert('Campos obligatorios', 'Título y artista.');

    try {
      const tok = await getToken();
      if (!tok) return Alert.alert('Error', 'No auth token (inicia sesión)');

      setLoading(true);
      setProgress(0);

      // Parsear numéricos (opcionalmente vacíos)
      const duration = toNumber(durationStr);
      const bpm = toNumber(bpmStr);
      const decade = toNumber(decadeStr);

      // 1) subir blob con metadata opcional
      const up = await uploadSongMultipart({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre.trim() || undefined,
        description: description.trim() || undefined,
        duration,
        bpm,
        decade,
        country: country.trim() || undefined,
        audio: audioFile,
        token: tok,
        onProgress: setProgress,
      });

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
      const audioUrl = audioUrlCandidates.find(
        (v) => typeof v === 'string' && v.length > 0
      ) as string | undefined;

      if (!audioUrl) {
        const backendMsg =
          (up && (up.message || up.error?.message)) || 'No se recibió URL del audio';
        throw new Error(String(backendMsg));
      }

      // 2) crear registro en DB
      await api.post('/songs', {
        title: title.trim(),
        artist: artist.trim(), // si tu backend no lo soporta, elimínalo
        description: description.trim() || null,
        audioUrl,
        duration: typeof duration === 'number' ? duration : null,
        bpm: typeof bpm === 'number' ? bpm : null,
        decade: typeof decade === 'number' ? decade : null,
        country: country.trim() || null,
        genre: genre.trim() || null,
      });

      Alert.alert('Listo', 'Canción subida.');
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
    } catch (e: unknown) {
      const message =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message?: unknown }).message)
          : 'No se pudo subir';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, top: 35 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Subir canción</Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 8,
          padding: 10,
        }}
        placeholderTextColor="#000000ff"
      />
      <TextInput
        placeholder="Artista"
        value={artist}
        onChangeText={setArtist}
        style={{
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 8,
          padding: 10,
        }}
        placeholderTextColor="#000000ff"
      />
      <TextInput
        placeholder="Género"
        value={genre}
        onChangeText={setGenre}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
        }}
        placeholderTextColor="#000000ff"
      />
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 8,
          padding: 10,
          minHeight: 80,
          textAlignVertical: 'top',
        }}
        placeholderTextColor="#000000ff"
      />
      <TextInput
        placeholder="Duración en segundos "
        value={durationStr}
        onChangeText={setDurationStr}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 8,
          padding: 10,
        }}
        placeholderTextColor="#000000ff"
      />
      <TextInput
        placeholder="BPM "
        value={bpmStr}
        onChangeText={setBpmStr}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 8,
          padding: 10,
        }}
        placeholderTextColor="#000000ff"
      />
      <TextInput
        placeholder="Década (ej. 1990) "
        value={decadeStr}
        onChangeText={setDecadeStr}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 8,
          padding: 10,
        }}
        placeholderTextColor="#000000ff"
      />
      <TextInput
        placeholder="País "
        value={country}
        onChangeText={setCountry}
        style={{
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 8,
          padding: 10,
        }}
        placeholderTextColor="#000000ff"
      />

      <Pressable
        onPress={handlePick}
        style={{
          backgroundColor: '#eee',
          borderRadius: 8,
          padding: 12,
          alignItems: 'center',
        }}
      >
        <Text>
          {audioName ? `Archivo: ${audioName}` : 'Elegir archivo de audio'}
        </Text>
      </Pressable>

      {loading ? (
        <View style={{ gap: 8 }}>
          <ActivityIndicator />
          <Text>Subiendo... {progress}%</Text>
          <View style={{ height: 8, backgroundColor: '#eee', borderRadius: 4 }}>
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
            padding: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Subir</Text>
        </Pressable>
      )}
    </View>
  );
}
