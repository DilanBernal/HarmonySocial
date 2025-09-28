import { Platform } from 'react-native';

const getBaseUrl = () => {
  // Development convenience: when running on Android emulator use host machine via 10.0.2.2
  // This avoids flaky dev-tunnel connectivity for uploads during development.
  if (__DEV__ && Platform.OS === 'android') {
    return 'https://fs571vhd-4666.use2.devtunnels.ms/api/';
  }
  return 'https://fs571vhd-4666.use2.devtunnels.ms/api/';
};

export const AppConfig = {
  apiBaseUrl: getBaseUrl(),
  apiTimeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'User-App',
  },
} as const;
