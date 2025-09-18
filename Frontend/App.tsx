import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, PermissionsAndroid } from 'react-native';
import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

import LoginScreen from './src/screens/auth/LoginScreen';
import MainTabs from './src/navigation/MainTabs';

export type RootStackParamList = { Login: undefined; Main: undefined };
const Stack = createNativeStackNavigator<RootStackParamList>();

let playerReady = false; // ← guard

async function setupPlayerOnce() {
  if (playerReady) return;
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
    }

    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: { appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback },
      capabilities: [
        Capability.Play, Capability.Pause, Capability.Stop,
        Capability.SkipToNext, Capability.SkipToPrevious,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
    });

    playerReady = true;
  } catch (e) {
    // En Fast Refresh puede intentar inicializar dos veces; ignóralo si ya está listo
    console.log('[TrackPlayer] setup error (ok si ya estaba iniciado):', (e as Error)?.message);
  }
}

export default function App() {
  useEffect(() => { setupPlayerOnce(); }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
