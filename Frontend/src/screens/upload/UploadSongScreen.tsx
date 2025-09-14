import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SongsService, SongCreateDTO } from "../../services/songs";
import { RESOLVED_HOST, API_BASE } from "../../services/api";


export default function UploadSongScreen() {
  const [form, setForm] = useState<Partial<SongCreateDTO>>({
    title: "",
    audioUrl: "",
    genre: "",
    duration: undefined,
    bpm: undefined,
    album: "",
  });
  const [loading, setLoading] = useState(false);

  const change = (k: keyof SongCreateDTO, v: any) => setForm(p => ({ ...p, [k]: v }));
  useEffect(() => {
    console.log("RESOLVED_HOST =>", RESOLVED_HOST);
    console.log("API_BASE      =>", API_BASE);
    fetch(`${API_BASE}/ping`)
        .then(r => r.text())
        .then(t => console.log("PING:", t))
        .catch(e => console.log("PING ERROR:", e.message));
    }, []);

  const submit = async () => {
    if (!form.title?.trim())  return Alert.alert("Falta título", "Ingresa el título.");
    if (!form.audioUrl?.trim()) return Alert.alert("Falta audioUrl", "Ingresa la URL del audio.");

    setLoading(true);
    try {
      const payload: SongCreateDTO = {
        title: form.title!.trim(),
        audioUrl: form.audioUrl!.trim(),
        description: form.description ?? null,
        duration: form.duration ? Number(form.duration) : null,
        bpm: form.bpm ? Number(form.bpm) : null,
        keyNote: form.keyNote ?? null,
        album: form.album ?? null,
        decade: form.decade ?? null,
        genre: form.genre ?? null,
        country: form.country ?? null,
        instruments: form.instruments ?? null,
        difficultyLevel: form.difficultyLevel ?? null,
        artistId: form.artistId ?? null,
        userId: form.userId ?? null,
        verifiedByArtist: !!form.verifiedByArtist,
        verifiedByUsers: !!form.verifiedByUsers,
      };
      await SongsService.create(payload);
      Alert.alert("Listo", "Canción creada correctamente.");
      setForm({ title: "", audioUrl: "", genre: "", duration: undefined, bpm: undefined, album: "" });
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo crear la canción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.h1}>Subir canción</Text>

      <Text style={s.label}>title </Text>
      <TextInput style={s.input} value={form.title ?? ""} onChangeText={(t) => change("title", t)} placeholder="Escribe el nombre tu cación" />

      <Text style={s.label}>Description </Text>
      <TextInput style={s.input} value={form.description ?? ""} onChangeText={(t) => change("description", t)} placeholder="Escribe la descripción"/>

      <Text style={s.label}>audioUrl </Text>
      <TextInput style={s.input} value={form.audioUrl ?? ""} onChangeText={(t) => change("audioUrl", t)} placeholder="https://..." autoCapitalize="none" />

      <Text style={s.label}>duration (seg)</Text>
      <TextInput style={s.input} value={form.duration?.toString() ?? ""} onChangeText={(t) => change("duration", t.replace(/[^0-9]/g, ""))} keyboardType="numeric" />

      <Text style={s.label}>bpm</Text>
      <TextInput style={s.input} value={form.bpm?.toString() ?? ""} onChangeText={(t) => change("bpm", t.replace(/[^0-9]/g, ""))} keyboardType="numeric" />

      <Text style={s.label}>decade</Text>


      <Text style={s.label}>genre</Text>
      <TextInput style={s.input} value={form.genre ?? ""} onChangeText={(t) => change("genre", t)} placeholder="Género" />

      {/* <Text style={s.label}>album</Text>
      <TextInput style={s.input} value={form.album ?? ""} onChangeText={(t) => change("album", t)} placeholder="Álbum" /> */}

      

      <TouchableOpacity onPress={submit} disabled={loading} style={[s.btn, loading && { opacity: 0.7 }]}>
        <Text style={s.btnText}>{loading ? "Guardando..." : "Crear canción"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0c16" },
  h1: { color: "#E6EAF2", fontSize: 22, fontWeight: "800", marginBottom: 12 },
  label: { color: "#9aa3b2", marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: "#151923", color: "#E6EAF2", borderWidth: 1, borderColor: "#242b38", borderRadius: 10, paddingHorizontal: 12, height: 44 },
  btn: { marginTop: 20, backgroundColor: "#22c55e", height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  btnText: { color: "white", fontWeight: "700", fontSize: 16 },
});
