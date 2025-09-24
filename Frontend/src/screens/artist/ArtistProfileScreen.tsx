import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ArtistsService } from '../../core/services/artist';

type Params = { artistId: string };
type RouteP = RouteProp<Record<'ArtistProfile', Params>, 'ArtistProfile'>;

export default function ArtistProfileScreen() {
  const { params } = useRoute<RouteP>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await ArtistsService.getById(params.artistId);
        setData((r as any).data ?? r);
      } catch (e) {
        console.log('[ArtistProfile] error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.artistId]);

  if (loading)
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
      </View>
    );
  if (!data)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0b0c16',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff' }}>No se pudo cargar</Text>
      </View>
    );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0b0c16', padding: 16 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Image
          source={{
            uri:
              data.avatarUrl ||
              'https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-7548-61f7-aaab-7797593c85b1/raw',
          }}
          style={{ width: 96, height: 96, borderRadius: 48 }}
        />
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: '700',
            marginTop: 10,
          }}
        >
          {data.artist_name ?? data.name}
        </Text>
      </View>

      <View
        style={{ backgroundColor: '#121626', borderRadius: 12, padding: 16 }}
      >
        {!!data.country_code && (
          <>
            <Text style={{ color: '#9aa3b2' }}>País</Text>
            <Text style={{ color: '#fff', marginBottom: 12 }}>
              {data.country_code}
            </Text>
          </>
        )}
        {!!data.formation_year && (
          <>
            <Text style={{ color: '#9aa3b2' }}>Desde</Text>
            <Text style={{ color: '#fff' }}>{data.formation_year}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}
