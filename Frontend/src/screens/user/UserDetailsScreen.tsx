// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, Image } from 'react-native';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { UsersService } from '../../core/services/users';

// type Params = { UserDetails: { userId?: string; usernameOrName?: string } };
// type ScreenRoute = RouteProp<Params, 'UserDetails'>;

// export default function UserDetailsScreen() {
//   const { params } = useRoute<ScreenRoute>();
//   const [user, setUser] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         setErr(null);
//         let u: AppUser | null = null;
//         if (params?.userId) u = await UsersService.getById(params.userId);
//         else if (params?.usernameOrName)
//           u = await UsersService.getByName(params.usernameOrName);
//         setUser(u);
//         if (!u) setErr('No hay registros para este usuario.');
//       } catch (e: any) {
//         setErr(e?.message || 'No se pudo cargar el usuario.');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [params?.userId, params?.usernameOrName]);

//   if (loading) return Loader('Cargando usuario…');
//   if (err || !user) return Message(err || 'No hay registros.');

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#0b0c16',
//         alignItems: 'center',
//         padding: 16,
//       }}
//     >
//       <Image
//         source={{ uri: user.avatarUrl || 'https://placehold.co/160x160/png' }}
//         style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 12 }}
//       />
//       <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
//         {user.name}
//       </Text>
//       {!!user.username && (
//         <Text style={{ color: '#9aa3b2', marginTop: 4 }}>@{user.username}</Text>
//       )}
//     </View>
//   );
// }

// function Loader(t: string) {
//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#0b0c16',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <ActivityIndicator />
//       <Text style={{ color: '#fff', marginTop: 8 }}>{t}</Text>
//     </View>
//   );
// }
// function Message(t: string) {
//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#0b0c16',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 16,
//       }}
//     >
//       <Text style={{ color: '#fff', textAlign: 'center' }}>{t}</Text>
//     </View>
//   );
// }
