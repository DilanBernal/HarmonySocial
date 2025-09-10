import { ImageSourcePropType } from 'react-native';

type User = {
  id: string;
  full_name: string;
  email: string;
  username: string;
  password: string;
  profile_image: string | ImageSourcePropType;
};

export default User;

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
  FROZEN = 'FROZEN',
}

export enum UserInstrument {
  GUITAR,
  PIANO,
  BASS,
}
