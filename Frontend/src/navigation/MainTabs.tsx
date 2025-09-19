import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet } from 'react-native';

import ProfileScreen from '../screens/auth/ProfileScreen';
import HomeScreen from '../screens/home/HomeScreen';
import UploadSongScreen from '../screens/upload/UploadSongScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import defaultColors from '../assets/style/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchScreen from '../screens/search/SearchScreen';
import SearchStack from '../navigation/SearchStack';



// function SubirCancion(){
//   return(
//     <View style={s.page}>
//       <Text style={s.text}>+</Text>
//     </View>
//   );
// }

function MySongsScreen() {
  return (
    <View style={s.page}>
      <Text style={s.text}>Biblioteca</Text>
    </View>
  );
}
// function ProfileScreen() { return <View style={s.page}><Text style={s.text}>Perfil</Text></View>; }

export type MainTabsParamList = {
  Home: undefined;
  Main: undefined;
  Register: undefined;
  Login: undefined;
  ResetPassword: undefined;
  Feed: undefined;
  Buscar: undefined;
  Subir: undefined;
  Biblioteca: undefined;
  Profile: undefined;
  caracteristicas: undefined
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        sceneStyle: {
          backgroundColor: defaultColors.background,
          paddingTop: insets.top,
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111418',
          borderTopColor: '#1f2430',
        },
        tabBarActiveTintColor: '#7C4DFF',
        tabBarInactiveTintColor: '#9aa3b2',
        tabBarIcon: ({ color, size, focused }) => {
          const map: Record<string, string> = {
            Feed: focused ? 'home' : 'home-outline',
            Buscar: focused ? 'Buscar' : 'Buscar-outline',
            Subir: focused ? 'add-circle' : 'add-circle-outline', // ⬅️
            Library: focused ? 'musical-notes' : 'musical-notes-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      {/* TU HOME dentro de las tabs */}
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      {/* <Tab.Screen
        name="Buscar"
        component={SearchScreen}
        options={{ title: 'Buscar' }}
      /> */}
      {/* Search */}
      <Tab.Screen
        name="Buscar"
        component={SearchStack}           
        options={{ title: 'Buscar' }}
      />

      
      <Tab.Screen
        name="Subir"
        component={UploadSongScreen}
        options={{ title: '+' }}
      />
      <Tab.Screen name="Biblioteca" component={LibraryScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainTabsParamList {}
  }
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0b0c16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#E6EAF2', fontSize: 20, fontWeight: '700' },
});
