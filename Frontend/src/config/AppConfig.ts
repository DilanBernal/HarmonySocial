import { Platform } from 'react-native';

// Para Android, necesitamos usar 10.0.2.2 en lugar de localhost en el emulador
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:4666/api/';
    } else {
      return 'http://localhost:4666/api/';
    }
  }
  // URL de producción (DevTunnels o servidor real)
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
