import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import type { ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginResponse from '../../core/dtos/LoginResponse';
import DEFAULT_AVATARS from '../../assets/defaultAvatars';
import ProfileImage from '../../components/general/ProfileImage';

// const AVATAR: ImageSourcePropType = require('../../assets/img/yoxd.jpg');

export default function ProfileScreen() {
  const rootNav = useNavigation<NavigationProp<RootStackParamList>>();
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined,
  );
  const [username, setUsername] = useState<string>('');
  const [memberSince, setMemberSince] = useState<string>('');

  useEffect(() => {
    const getUserData = async () => {
      const userStorage = await AsyncStorage.getItem('userData');
      console.log(userStorage);
      if (!userStorage) {
        onLogout();
        return;
      }
      try {
        const userJson = JSON.parse(userStorage);
        console.log(userJson);
        setProfileImage(userJson.profile_image);
        setUsername(userJson.username || '');
        // Si tienes la fecha de registro, puedes setearla aquí
        setMemberSince(userJson.activeFrom || '');
        // setMemberSince('2022'); // Hardcodeado por ahora
      } catch (error) {
        // Si hay error, forzar logout
        onLogout();
      }
    };
    getUserData();
  }, []);

  const onLogout = async () => {
    await AsyncStorage.removeItem('user');
    rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={s.container}>
      <View style={s.innerContainer}>
        <ProfileImage image={profileImage} imageStyle={s.avatar} />
        <Text style={s.name}>{username || 'Usuario'}</Text>
        <Text style={s.muted}>Miembro desde {memberSince}</Text>

        <Pressable style={s.btn} onPress={onLogout}>
          <Text style={s.btnText}>Cerrar sesión</Text>
        </Pressable>
      </View>
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
  innerContainer: {
    height: ' 100%',
    flex: 1,
    paddingVertical: 50,
    alignItems: 'center',
    verticalAlign: 'middle',
    alignContent: 'center',
    margin: 'auto',
  },
});
