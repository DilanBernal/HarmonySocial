import React, { useMemo } from 'react';
import { FlatList, ImageSourcePropType } from 'react-native';
import IniciarSesion from '../auth/IniciarSesion';
import Post from '../../models/Post';
import PostCard from '../../components/PostCard';
import User from '../../models/User';

const AVATAR: ImageSourcePropType = require('../assets/img/yoxd.jpg');
const IMG_CHINACOTA: ImageSourcePropType = require('../assets/img/chinacotaxd.jpg');

const FRIENDS: User[] = [
  { id: 's1', name: 'Chinacota', avatar: IMG_CHINACOTA }, // local
  {
    id: 's2',
    name: 'Sarah',
    avatar: {
      uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80',
    },
  },
  {
    id: 's3',
    name: 'Daniel',
    avatar: {
      uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=256&q=80',
    },
  },
  {
    id: 's4',
    name: 'Leo',
    avatar: {
      uri: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80',
    },
  },
];

const FEED: Post[] = [
  {
    id: '1',
    user: 'Chinacota',
    avatar: FRIENDS[0]?.avatar ?? AVATAR,
    time: '2 h',
    title: 'Night Drive',
    artist: 'Midnight Crew',
    cover: require('../assets/img/imgmusica.jpg'),
    likes: 128,
    comments: 24,
  },
  {
    id: '2',
    user: 'Luis',
    avatar: FRIENDS[1].avatar,
    time: '5 h',
    title: 'Ocean Eyes',
    artist: 'Blue Coast',
    cover: {
      uri: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&q=80',
    },
    likes: 84,
    comments: 10,
  },
];

/* ---------- Home principal ---------- */
export default function IniciarSesionPrincipal() {
  const header = useMemo(() => <IniciarSesion />, []);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: '#0b0c16' }}
      data={FEED}
      keyExtractor={i => i.id}
      ListHeaderComponent={header}
      contentContainerStyle={{ paddingBottom: 24 }}
      renderItem={({ item }) => <PostCard p={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
