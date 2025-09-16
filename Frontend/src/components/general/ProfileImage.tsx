import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

import DEFAULT_AVATARS, {
  DEFAULT_AVATAR_KEY,
} from '../../assets/defaultAvatars';

type ImageProp = ImageSourcePropType | string | undefined;

// default local avatar (keep the same asset used in HomeHeader)
const DEFAULT_AVATAR: ImageSourcePropType = DEFAULT_AVATARS[DEFAULT_AVATAR_KEY];

const ProfileImage = ({
  image,
  size = 60,
  onPress,
  imageStyle,
  containerStyle,
}: {
  image?: ImageProp;
  size?: number;
  onPress?: () => void;
  imageStyle?: StyleProp<any>;
  containerStyle?: StyleProp<any>;
}) => {
  let source: ImageSourcePropType;

  if (!image) {
    source = DEFAULT_AVATAR;
  } else if (typeof image === 'string') {
    // If the string matches a default avatar key, use the local asset
    if (DEFAULT_AVATARS[image]) {
      source = DEFAULT_AVATARS[image];
    } else if (/^(https?:\/\/|file:\/\/|content:\/\/)/.test(image)) {
      // remote URL or file path -> use { uri }
      source = { uri: image };
    } else {
      // unknown string: try using it as a uri (safe fallback)
      source = { uri: image };
    }
  } else {
    // already an ImageSource (number or object returned by require(...))
    source = image;
  }

  let pressAction;

  if (onPress) {
    pressAction = onPress;
  } else {
    pressAction = () => {};
  }
  return (
    <TouchableHighlight
      underlayColor="transparent"
      style={containerStyle}
      onPress={pressAction}
    >
      <Image source={source} style={imageStyle} />
    </TouchableHighlight>
  );
};

export default ProfileImage;
