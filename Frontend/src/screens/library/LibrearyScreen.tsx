import React, { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SongsService, Song } from "../../services/songs";

export default function LibraryScreen() {
  const [items, setItems] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      console.log("[Library] fetching /songs/mine/list …");
      const r = await SongsService.listMine(1, 50);
      console.log("[Library] response:", r);
      const rows = r?.data?.rows ?? [];
      setItems(rows);
    } catch (e: any) {
      const msg = e?.message ?? "No se pudo cargar tu biblioteca";
      console.log("[Library] ERROR:", msg);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0c16", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ color: "#fff", marginTop: 8 }}>Cargando tu biblioteca…</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0c16", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ color: "#fff", marginBottom: 12 }}>{err}</Text>
        <Pressable onPress={load} style={{ padding: 10, backgroundColor: "#4f46e5", borderRadius: 8 }}>
          <Text style={{ color: "#fff" }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b0c16", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#fff" }}>Aún no tienes canciones subidas</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0c16", paddingTop: 8 }}>
      <FlatList
        data={items}
        keyExtractor={(s) => String(s.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#151827", padding: 12, borderRadius: 12 }}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>{item.title}</Text>
            <Text style={{ color: "#9aa3b2", marginTop: 4 }} numberOfLines={1}>
              {item.audioUrl}
            </Text>
            <Text style={{ color: "#667085", marginTop: 6, fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
