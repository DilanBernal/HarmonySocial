import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, Pressable } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SongsService, Song } from '../../core/services/songs';
import { playSong } from '../../core/player/playerSetup';

type Params = { SongDetails: { songId: string } };
type ScreenRoute = RouteProp<Params, 'SongDetails'>;

export default function SongDetailsScreen() {
  const { params } = useRoute<ScreenRoute>();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const s = await SongsService.getById(params.songId);
        setSong(s);
        if (!s) setErr('No hay registros para esta canción.');
      } catch (e: any) {
        setErr(e?.message || 'No se pudo cargar la canción.');
      } finally {
        setLoading(false);
      }
    })();
  }, [params.songId]);

  if (loading) return Loader('Cargando canción…');
  if (err || !song) return Message(err || 'No hay registros.');

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0c16', padding: 16 }}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={{ uri: song.artwork || 'https://placehold.co/200x200/png' }}
          style={{
            width: 160,
            height: 160,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
          {song.title}
        </Text>
        {!!(song as any).artist && (
          <Text style={{ color: '#9aa3b2', marginTop: 4 }}>
            {(song as any).artist}
          </Text>
        )}
      </View>

      <Pressable
        onPress={() => playSong({ title: song.title, audioUrl: song.audioUrl })}
        style={{
          marginTop: 20,
          backgroundColor: '#4f46e5',
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Reproducir</Text>
      </Pressable>
    </View>
  );
}
function Loader(t: string) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0b0c16',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator />
      <Text style={{ color: '#fff', marginTop: 8 }}>{t}</Text>
    </View>
  );
}
function Message(t: string) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0b0c16',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Text style={{ color: '#fff', textAlign: 'center' }}>{t}</Text>
    </View>
  );
}
