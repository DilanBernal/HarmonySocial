import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import type { ImageSourcePropType } from 'react-native';

const AVATAR: ImageSourcePropType = require('../../assets/img/yoxd.jpg');

export default function ProfileScreen() {
  const rootNav = useNavigation<NavigationProp<RootStackParamList>>();

  const onLogout = () => {
    // aquí podrías borrar token/estado (AsyncStorage, contexto, etc.)
    rootNav.reset({ index: 0, routes: [{ name: 'Login' }] }); // limpia el stack y vuelve a Login
  };

  return (
    <View style={s.container}>
      <Image source={AVATAR} style={s.avatar} />
      <Text style={s.name}>Fabis</Text>
      <Text style={s.muted}>Miembro desde 2022</Text>

      <Pressable style={s.btn} onPress={onLogout}>
        <Text style={s.btnText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c16',
    alignItems: 'center',
    paddingTop: 40,
  },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  name: { color: '#E6EAF2', fontSize: 20, fontWeight: '800' },
  muted: { color: '#9AA3B2', marginTop: 4, marginBottom: 24 },
  btn: {
    marginTop: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: { color: 'white', fontWeight: '800' },
});
