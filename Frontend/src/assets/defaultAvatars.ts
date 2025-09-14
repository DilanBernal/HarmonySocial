import type { ImageSourcePropType } from 'react-native';

// Keep filenames exactly as they are in the img folder
export const DEFAULT_AVATARS: Record<string, ImageSourcePropType> = {
  avatar1: require('./img/profile-generig-img-1.png'),
  avatar2: require('./img/profile-generig-img-2.png'),
  avatar3: require('./img/profile-generig-img-3.png'),
  avatar4: require('./img/profile-generig-img-4.png'),
  avatar5: require('./img/profile-generig-img-5.png'),
  avatar6: require('./img/profile-generig-img-6.png'),
  avatar7: require('./img/profile-generig-img-7.png'),
  avatar8: require('./img/profile-generig-img-8.png'),
};

export const DEFAULT_AVATAR_KEY = 'avatar1';

export default DEFAULT_AVATARS;
