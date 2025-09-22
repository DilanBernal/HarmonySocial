import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Song, SongsService } from '../../core/services/song/GetSongsService';
import {
  playSongByBlob,
  setupPlayer,
  songRequest,
} from '../../player/controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setupPlayer();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await SongsService.listMine(1, 50);
      r.data.rows.forEach(x => {
        console.log(x);
      });
      setItems(r?.data?.rows ?? []);
    } catch (e: any) {
      setErr(e?.message ?? 'No se pudo cargar tu biblioteca');
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
      <View
        style={{
          flex: 1,
          backgroundColor: '#0b0c16',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
        }}
      >
        <ActivityIndicator />
        <Text style={{ color: '#fff', marginTop: 8 }}>
          Cargando tu biblioteca…
        </Text>
      </View>
    );
  }

  if (err) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0b0c16',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
          padding: 16,
        }}
      >
        <Text style={{ color: '#fff', marginBottom: 12 }}>{err}</Text>
        <Pressable
          onPress={load}
          style={{ padding: 10, backgroundColor: '#4f46e5', borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0b0c16',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top,
        }}
      >
        <Text style={{ color: '#fff' }}>Aún no tienes canciones subidas</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0b0c16',
        paddingTop: insets.top,
      }}
    >
      {/* Botón de prueba con MP3 público para verificar el pipeline del player */}
      {/* <Pressable
        onPress={playTest}
        style={{
          margin: 12,
          backgroundColor: '#22c55e',
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>
          ▶️ Probar reproducción (HTTPS)
        </Text>
      </Pressable> */}

      <FlatList
        data={items}
        keyExtractor={s => String(s.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              playSongByBlob({
                blobName: item.audioUrl,
                title: item.title,
              } as songRequest)
            }
          >
            <View
              style={{
                backgroundColor: '#151827',
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {item.title}
              </Text>
              <Text
                style={{ color: '#9aa3b2', marginTop: 4 }}
                numberOfLines={1}
              >
                {item.audioUrl}
              </Text>
              {'createdAt' in item && (
                <Text style={{ color: '#667085', marginTop: 6, fontSize: 12 }}>
                  {new Date((item as any).createdAt).toLocaleString()}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
