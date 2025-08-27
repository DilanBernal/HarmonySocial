import { ImageSourcePropType } from 'react-native';

type Post = {
  id: string;
  user: string;
  songId: number;
  avatar: ImageSourcePropType;
  time: string;
  title: string;
  artist: string;
  cover: ImageSourcePropType;
  likes: number;
  comments: number;
};

export default Post;
