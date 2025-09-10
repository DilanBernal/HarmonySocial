import { FlatList, ImageSourcePropType, StyleSheet, View } from 'react-native';
import HomeHeader from '../../components/home/HomeHeaderComponent';
import PostCard from '../../components/home/PostCard';
import Post from '../../models/Post';
import User from '../../models/User';
import { useMemo } from 'react';
import defaultColors from '../../assets/style/colors';
import DEFAULT_AVATARS, {
  DEFAULT_AVATAR_KEY,
} from '../../assets/defaultAvatars';

const AVATAR: ImageSourcePropType = DEFAULT_AVATARS[DEFAULT_AVATAR_KEY];

function resolveImage(
  img: string | ImageSourcePropType | undefined,
): ImageSourcePropType {
  if (!img) return AVATAR;
  if (typeof img === 'string') {
    if (DEFAULT_AVATARS[img]) return DEFAULT_AVATARS[img];
    if (/^(https?:\/\/|file:\/\/|content:\/\/)/.test(img))
      return { uri: img } as ImageSourcePropType;
    // fallback: try as uri
    return { uri: img } as ImageSourcePropType;
  }
  return img;
}

const FRIENDS: User[] = [
  {
    id: 's1',
    full_name: 'Chinacota',
    email: 'chinacota@example.com',
    username: 'chinacota',
    password: '',
    profile_image: 'avatar4', // default local avatar key
  },
  {
    id: 's2',
    full_name: 'Sarah',
    email: 'sarah@example.com',
    username: 'sarah',
    password: '',
    profile_image: {
      uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80',
    },
  },
  {
    id: 's3',
    full_name: 'Daniel',
    email: 'daniel@example.com',
    username: 'daniel',
    password: '',
    profile_image: {
      uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=256&q=80',
    },
  },
  {
    id: 's4',
    full_name: 'Leo',
    email: 'leo@example.com',
    username: 'leo',
    password: '',
    profile_image: {
      uri: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&q=80',
    },
  },
];

const FEED: Post[] = [
  {
    id: '1',
    user: 'Chinacota',
    songId: 1,
    avatar: resolveImage(FRIENDS[0]?.profile_image) ?? AVATAR,
    time: '2 h',
    title: 'Night Drive',
    artist: 'Midnight Crew',
    cover: require('../../assets/img/imgmusica.jpg'),
    likes: 128,
    comments: 24,
  },
  {
    id: '2',
    user: 'Luisa',
    songId: 2,
    avatar: resolveImage(FRIENDS[1].profile_image),
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

const HomeScreen = () => {
  const header = useMemo(() => <HomeHeader />, []);

  return (
    <View style={styles.homeContainer}>
      <FlatList
        style={{ flex: 1, backgroundColor: '#0b0c16' }}
        data={FEED}
        ListHeaderComponent={header}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => <PostCard p={item} />}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: defaultColors.background,
  },
});

export default HomeScreen;
