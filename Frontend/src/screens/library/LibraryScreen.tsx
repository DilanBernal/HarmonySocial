import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  GetSongsService,
  Song,
  songsService, // Cambiado de SongsService a songsService (la instancia)
} from '../../core/services/song/GetSongsService';
import {
  playSongByBlob,
  setupPlayer,
  songRequest,
} from '../../player/controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRxSubscriptions } from '../../hooks/useRxSubscriptions';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const { addSubscription } = useRxSubscriptions();

  const isLoadingRef = useRef(false);

  useEffect(() => {
    console.log('[LibraryScreen] useEffect - Initial mount, calling load()');
    load();
  }, []);

  const load = () => {
    if (isLoadingRef.current) {
      console.log('[LibraryScreen] Already loading, skipping...');
      return;
    }

    console.log('[LibraryScreen] Starting load...');
    isLoadingRef.current = true;
    setLoading(true);
    setErr(null);
    try {
      const subscription = songsService.listMine(1, 50).subscribe({
        next: (response: any) => {
          console.log('Library response:', response);
          const songs = response?.data?.data?.rows ?? [];

          songs.forEach((song: Song) => {
            console.log('Song:', song);
          });

          setItems(songs);
          setLoading(false);
          isLoadingRef.current = false;
        },
        error: (error: any) => {
          console.error('Library error:', error);
          setErr(error?.message ?? 'No se pudo cargar tu biblioteca');
          setLoading(false);
          isLoadingRef.current = false;
        },
      });

      // Usar el hook para manejo automático de subscripciones
      addSubscription(subscription);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? 'No se pudo cargar tu biblioteca');
      setLoading(false);
      isLoadingRef.current = false;
    }
  }; // ✅ Sin useCallback para evitar dependencias circulares

  // ✅ COMENTAMOS useFocusEffect temporalmente para debuggear el bucle infinito
  /*
  useFocusEffect(
    useCallback(() => {
      console.log('[LibraryScreen] useFocusEffect triggered');
      load();

      // Cleanup para prevenir múltiples subscripciones
      return () => {
        console.log('[LibraryScreen] useFocusEffect cleanup');
      };
    }, [load]),
  );
  */

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
