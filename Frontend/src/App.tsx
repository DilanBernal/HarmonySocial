// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import MainTabs from './navigation/MainTabs';
import RegisterScreen from '../src/screens/RegisterScreen'; 
import ResetPasswordScreen from '../src/screens/ResetPasswordScreen'; 

export type RootStackParamList = {
  Login: undefined;
  Main: undefined; 
  Register: undefined;
  ResetPassword: undefined; 

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: true, title: 'Crear cuenta' }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: true, title: 'Restablecer contraseña' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
