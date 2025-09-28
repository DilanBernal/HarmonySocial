import { FlatList, ImageSourcePropType, StyleSheet, View } from 'react-native';
import HomeHeader from '../../components/home/HomeHeaderComponent';
import PostCard from '../../components/home/PostCard';
// import Post from '../../core/models/Post';
// import User from '../../core/models/User';
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

const HomeScreen = () => {
  const header = useMemo(() => <HomeHeader />, []);

  return (
    <View style={styles.homeContainer}>
      <FlatList
        style={{ flex: 1, backgroundColor: '#0b0c16' }}
        data={null}
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
