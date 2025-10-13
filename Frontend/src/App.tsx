// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import MainTabs from './navigation/MainTabs';
// import RegisterScreen from './screens/auth/RegisterScreen';
// import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';
// import LoginScreen from './screens/auth/LoginScreen';
// import defaultColors from './assets/style/colors';

// export type RootStackParamList = {
//   Login: undefined;
//   Main: undefined;
//   Register: undefined;
//   ResetPassword: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{ headerShown: false }}
//         initialRouteName="Login"
//       >
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Main" component={MainTabs} />
//         <Stack.Screen
//           name="Register"
//           component={RegisterScreen}
//           options={{
//             headerShown: true,
//             title: 'Crear cuenta',
//             headerStyle: { backgroundColor: defaultColors.lightBackground },
//             headerTintColor: '#fff',
//           }}
//         />
//         <Stack.Screen
//           name="ResetPassword"
//           component={ResetPasswordScreen}
//           options={{
//             headerShown: true,
//             title: 'Restablecer contraseña',
//             headerStyle: { backgroundColor: defaultColors.lightBackground },
//             headerTintColor: '#fff',
//           }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
