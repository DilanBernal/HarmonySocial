import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ArtistsService, Artist } from '../../services/artist';

type Params = { ArtistDetails: { artistId?: string; artistName?: string } };
type ScreenRoute = RouteProp<Params, 'ArtistDetails'>;

export default function ArtistDetailsScreen() {
  const { params } = useRoute<ScreenRoute>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        let a: Artist | null = null;
        if (params?.artistId) {
          a = await ArtistsService.getById(params.artistId);
        } else if (params?.artistName) {
          a = await ArtistsService.getByName(params.artistName);
        }
        setArtist(a);
        if (!a) setErr('No hay registros para este artista.');
      } catch (e: any) {
        setErr(e?.message || 'No se pudo cargar el artista.');
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.artistId, params?.artistName]);

  if (loading) {
    return <View style={{ flex:1, backgroundColor:'#0b0c16', alignItems:'center', justifyContent:'center' }}>
      <ActivityIndicator />
      <Text style={{ color:'#fff', marginTop:8 }}>Cargando artista…</Text>
    </View>;
  }

  if (err || !artist) {
    return <View style={{ flex:1, backgroundColor:'#0b0c16', alignItems:'center', justifyContent:'center', padding:16 }}>
      <Text style={{ color:'#fff', textAlign:'center' }}>{err || 'No hay registros.'}</Text>
    </View>;
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#0b0c16' }} contentContainerStyle={{ padding:16 }}>
      <View style={{ alignItems:'center' }}>
        <Image source={{ uri: artist.avatarUrl || 'https://placehold.co/160x160/png' }}
               style={{ width:120, height:120, borderRadius:60, marginBottom:12 }}/>
        <Text style={{ color:'#fff', fontSize:20, fontWeight:'700' }}>{artist.artist_name}</Text>
        {!!artist.verified && <Text style={{ color:'#22c55e', marginTop:4 }}>Verificado</Text>}
      </View>

      <View style={{ marginTop:16, backgroundColor:'#151827', padding:12, borderRadius:12 }}>
        <Row label="Año de formación" value={artist.formation_year ?? '-'} />
        <Row label="País" value={artist.country_code ?? '-'} />
        <Row label="Estado" value={artist.status ?? '-'} />
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <View style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical:6 }}>
      <Text style={{ color:'#9aa3b2' }}>{label}</Text>
      <Text style={{ color:'#fff', fontWeight:'600' }}>{String(value)}</Text>
    </View>
  );
}
