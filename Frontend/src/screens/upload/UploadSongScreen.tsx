import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { pickAudio, uploadSongMultipart } from "../../services/upload";
import { api, getToken } from "../../services/api";
import type { DocumentPickerResponse } from "@react-native-documents/picker";

export default function UploadSongScreen() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState("");
  const [audioName, setAudioName] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<DocumentPickerResponse | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handlePick = async () => {
    const f = await pickAudio();
    if (!f) return;
    setAudioFile(f);
    setAudioName(f.name ?? "audio");
  };

  const handleUpload = async () => {
    if (!audioFile) return Alert.alert("Falta el audio", "Selecciona un archivo.");
    if (!title.trim() || !artist.trim()) return Alert.alert("Campos obligatorios", "Título y artista.");

    try {
      const tok = await getToken();
      if (!tok) return Alert.alert("Error", "No auth token (inicia sesión)");

      setLoading(true); setProgress(0);

      // 1) subir blob
      const up = await uploadSongMultipart({
        title: title.trim(),
        artist: artist.trim(),
        genre: genre.trim() || undefined,
        audio: audioFile,
        token: tok,
        onProgress: setProgress,
      });
      // API /api/file/song devuelve { success, data: { url, blobName } }
      const audioUrl: string | undefined = up?.data?.url || up?.url;
      if (!audioUrl) throw new Error("No se recibió URL del audio");

      // 2) crear registro en DB
      await api.post("/songs", {
        title: title.trim(),
        audioUrl,
        description: null,
        genre: genre.trim() || null,
        // Si luego agregas userId desde el JWT, envíalo aquí
      });

      Alert.alert("Listo", "Canción subida.");
      setTitle(""); setArtist(""); setGenre("");
      setAudioFile(null); setAudioName(null); setProgress(0);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo subir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Subir canción</Text>

      <TextInput placeholder="Título" value={title} onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 }} />
      <TextInput placeholder="Artista" value={artist} onChangeText={setArtist}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 }} />
      <TextInput placeholder="Género (opcional)" value={genre} onChangeText={setGenre}
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 }} />

      <Pressable onPress={handlePick}
        style={{ backgroundColor: "#eee", borderRadius: 8, padding: 12, alignItems: "center" }}>
        <Text>{audioName ? `Archivo: ${audioName}` : "Elegir archivo de audio"}</Text>
      </Pressable>

      {loading ? (
        <View style={{ gap: 8 }}>
          <ActivityIndicator />
          <Text>Subiendo... {progress}%</Text>
          <View style={{ height: 8, backgroundColor: "#eee", borderRadius: 4 }}>
            <View style={{ width: `${progress}%`, height: "100%", backgroundColor: "#4f46e5", borderRadius: 4 }} />
          </View>
        </View>
      ) : (
        <Pressable onPress={handleUpload}
          style={{ backgroundColor: "#4f46e5", borderRadius: 8, padding: 12, alignItems: "center" }}>
          <Text style={{ color: "white", fontWeight: "600" }}>Subir</Text>
        </Pressable>
      )}
    </View>
  );
}
