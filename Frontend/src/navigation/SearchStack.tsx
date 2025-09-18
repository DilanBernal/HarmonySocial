import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from '../screens/search/SearchScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';
import ArtistProfileScreen from '../screens/artist/ArtistProfileScreen';

export type SearchStackParamList = {
  SearchHome: undefined;
  UserProfile: { userId: string };
  ArtistProfile: { artistId: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SearchHome">
      <Stack.Screen name="SearchHome" component={SearchScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} />
    </Stack.Navigator>
  );
}
