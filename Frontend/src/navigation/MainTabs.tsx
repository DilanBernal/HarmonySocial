import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet } from 'react-native';

import IniciarSesion from '../screens/auth/IniciarSesion';
import ProfileScreen from '../screens/auth/ProfileScreen';

function SearchScreen() {
  return (
    <View style={s.page}>
      <Text style={s.text}>Buscar</Text>
    </View>
  );
}
function LibraryScreen() {
  return (
    <View style={s.page}>
      <Text style={s.text}>Biblioteca</Text>
    </View>
  );
}
// function ProfileScreen() { return <View style={s.page}><Text style={s.text}>Perfil</Text></View>; }

export type MainTabsParamList = {
  Feed: undefined;
  Search: undefined;
  Library: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#111418', borderTopColor: '#1f2430' },
        tabBarActiveTintColor: '#7C4DFF',
        tabBarInactiveTintColor: '#9aa3b2',
        tabBarIcon: ({ color, size, focused }) => {
          const map: Record<string, string> = {
            Feed: focused ? 'home' : 'home-outline',
            Search: focused ? 'search' : 'search-outline',
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
        component={IniciarSesion}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Buscar' }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: 'Biblioteca' }}
      />
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
