import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { UsersService } from '../../core/services/users';

type Params = { userId: string | number };
type RouteP = RouteProp<Record<'UserProfile', Params>, 'UserProfile'>;

export default function UserProfileScreen() {
  const { params } = useRoute<RouteP>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await UsersService.getBasicInfo(params.userId);
        setData(r);
      } catch (e) {
        console.log('[UserProfile] error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.userId]);

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
              data.profileImage ||
              'https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png',
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
          {data.fullName}
        </Text>
        {!!data.username && (
          <Text style={{ color: '#9aa3b2', marginTop: 4 }}>
            @{data.username}
          </Text>
        )}
      </View>

      <View
        style={{ backgroundColor: '#121626', borderRadius: 12, padding: 16 }}
      >
        <Text style={{ color: '#9aa3b2' }}>Email</Text>
        <Text style={{ color: '#fff', marginBottom: 12 }}>{data.email}</Text>

        <Text style={{ color: '#9aa3b2' }}>Puntos</Text>
        <Text style={{ color: '#fff', marginBottom: 12 }}>
          {data.learningPoints}
        </Text>

        <Text style={{ color: '#9aa3b2' }}>Miembro desde</Text>
        <Text style={{ color: '#fff' }}>{data.activeFrom}</Text>
      </View>
    </ScrollView>
  );
}
