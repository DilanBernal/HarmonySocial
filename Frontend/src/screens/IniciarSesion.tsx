import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  TextInput,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabsParamList } from '../navigation/MainTabs';



const AVATAR: ImageSourcePropType = require ('../assets/img/yoxd.jpg')
  // 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=256&fit=crop';

const IMG_CHINACOTA: ImageSourcePropType = require('../assets/img/chinacotaxd.jpg')

type Friend = { id: string; name: string; avatar: ImageSourcePropType };
type Playlist = { id: string; title: string; cover: ImageSourcePropType };




const FRIENDS: Friend[] = [
  { id: 's1', name: 'Chinacota', avatar: IMG_CHINACOTA }, // local
  { id: 's2', name: 'Sarah',      avatar: { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80' } },
  { id: 's3', name: 'Daniel',       avatar: { uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=256&q=80' } },
  { id: 's4', name: 'Leo',       avatar: { uri: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80' } },
];

const PLAYLISTS: Playlist [] = [
  {
    id: 'p1',
    title: 'Mezcla diaria',
    cover: {uri: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=800&q=80'},
  },
  {
    id: 'p2',
    title: 'Lo-Fi Beats',
    cover: {uri:'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'},
  },
  {
    id: 'p3',
    title: 'Éxitos Latinos',
    cover: {uri:'https://images.unsplash.com/photo-1499428665502-503f6c608263?w=800&q=80'},
  },
];

type Post = {
  id: string;
  user: string;
  avatar: ImageSourcePropType;
  time: string;
  title: string;
  artist: string;
  cover: ImageSourcePropType;
  likes: number;
  comments: number;
};

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
    cover: { uri: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&q=80' },
    likes: 84,
    comments: 10,
  },
];

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/* ----------  saludo + buscador + historias + playlists ---------- */
function IniciarSesion() {
  const tabNav = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();
  const greet = useGreeting();

  return (
    <View>
      {/* Top bar */}
      <View style={s.topbar}>
        <Text style={s.logoText}>Harmony</Text>

        <Pressable
          onPress={() => tabNav.navigate('Profile')}
          android_ripple={{ color: '#ffffff22', borderless: true }}
          style={{ borderRadius: 17 }}
        >
          <Image source={AVATAR} style={s.avatar} />
        </Pressable>
      </View>

      {/* Saludo */}
      <Text style={s.greeting}>{greet} 👋</Text>
      <Text style={s.subtitle}>Explora música nueva y lo que comparten tus amigos.</Text>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={20} color="#9AA3B2" />
        <TextInput
          placeholder="Buscar canciones, artistas o amigos"
          placeholderTextColor="#8A90A6"
          style={s.searchInput}
        />
        <Ionicons name="mic-outline" size={20} color="#9AA3B2" />
      </View>

      {/* Historias */}
      <Text style={s.sectionTitle}>Historias</Text>
      <FlatList
        data={FRIENDS}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <Pressable android_ripple={{ color: '#ffffff22', borderless: true }}>
            <LinearGradient colors={['#7C4DFF', '#4C63F2']} style={s.storyRing}>
              <Image source={item.avatar} style={s.storyImg} />
            </LinearGradient>
            <Text numberOfLines={1} style={s.storyName}>{item.name}</Text>
          </Pressable>
        )}
      />

      {/* Playlists destacadas */}
      <Text style={[s.sectionTitle, { marginTop: 14 }]}>Para ti</Text>
      <FlatList
        data={PLAYLISTS}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <Pressable style={s.plItem}>
            <ImageBackground
              source={item.cover}
              imageStyle={s.plImage}
              style={s.plImage}
            >
              <LinearGradient
                colors={['#00000000', '#000000aa']}
                style={s.plOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              <Text style={s.plTitle}>{item.title}</Text>
            </ImageBackground>
          </Pressable>
        )}
      />
    </View>
  );
}

/* ---------- Card del feed ---------- */
function PostCard({ p }: { p: Post }) {
  return (
    <View style={s.card}>
      {/* header */}
      <View style={s.cardHead}>
        <Image source={p.avatar} style={s.cardAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.cardUser}>{p.user}</Text>
          <Text style={s.cardTime}>{p.time}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#9AA3B2" />
      </View>

      {/* cover */}
      <Image source={p.cover} style={s.cardCover} />

      {/* info */}
      <View style={s.cardMeta}>
        <Text style={s.cardTitle}>{p.title}</Text>
        <Text style={s.cardArtist}>{p.artist}</Text>
      </View>

      {/* acciones */}
      <View style={s.cardActions}>
        <View style={s.row}>
          <Ionicons name="heart-outline" size={22} color="#C9D0E3" />
          <Text style={s.actionText}>{p.likes}</Text>
          <Ionicons name="chatbubble-outline" size={22} color="#C9D0E3" style={{ marginLeft: 14 }} />
          <Text style={s.actionText}>{p.comments}</Text>
        </View>
        <View style={s.row}>
          <Ionicons name="share-social-outline" size={22} color="#C9D0E3" />
          <Ionicons name="play-circle-outline" size={26} color="#C9D0E3" style={{ marginLeft: 14 }} />
        </View>
      </View>
    </View>
  );
}

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

const s = StyleSheet.create({
  /* top */
  topbar: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: { color: '#E6EAF2', fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  avatar: { width: 34, height: 34, borderRadius: 17 },

  greeting: { color: '#E6EAF2', fontSize: 20, fontWeight: '800', paddingHorizontal: 16, marginTop: 6 },
  subtitle: { color: '#A8B0C3', fontSize: 13, paddingHorizontal: 16, marginTop: 2, marginBottom: 12 },

  searchWrap: {
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1a1f28',
    borderWidth: 1,
    borderColor: '#2b3240',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, color: '#DDE3F0', paddingVertical: 0 },

  sectionTitle: { color: '#E6EAF2', fontWeight: '800', fontSize: 16, paddingHorizontal: 16, marginTop: 12, marginBottom: 8 },

  /* historias */
  storyRing: {
    width: 64, height: 64, borderRadius: 999, padding: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  storyImg: { width: 60, height: 60, borderRadius: 999, backgroundColor: '#222' },
  storyName: { color: '#C8CFDD', fontSize: 11, textAlign: 'center', marginTop: 6, width: 64 },

  /* playlists */
  plItem: { width: 160, height: 120, borderRadius: 14, overflow: 'hidden' },
  plImage: { width: '100%', height: '100%', borderRadius: 14 },
  plOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, borderRadius: 14 },
  plTitle: { position: 'absolute', left: 10, bottom: 10, color: '#F1F4FF', fontWeight: '800' },

  /* feed cards */
  card: {
    backgroundColor: '#171b23',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242b37',
    marginTop: 14,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  cardAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#222' },
  cardUser: { color: '#E6EAF2', fontWeight: '700' },
  cardTime: { color: '#9AA3B2', fontSize: 12 },

  cardCover: { width: '100%', height: 190, backgroundColor: '#222' },
  cardMeta: { paddingHorizontal: 12, paddingTop: 10 },
  cardTitle: { color: '#EDEFFF', fontWeight: '800', fontSize: 16 },
  cardArtist: { color: '#A8B0C3', marginTop: 2 },

  cardActions: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionText: { color: '#C9D0E3', marginLeft: 6, fontWeight: '600' },

  /* page base */
  page: { flex: 1, backgroundColor: '#0b0c16', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#E6EAF2', fontSize: 20, fontWeight: '700' },
});
