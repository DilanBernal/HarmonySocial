import { Platform } from 'react-native';

// Para Android, necesitamos usar 10.0.2.2 en lugar de localhost en el emulador
const getBaseUrl = () => {
  return 'https://harmonysocial-api-dccfchgmetfcdpa7.eastus2-01.azurewebsites.net/api/';
  // if (__DEV__) {
  //   if (Platform.OS === 'android') {
  //     return 'http://10.0.2.2:4666/api/';
  //   } else {
  //     return 'http://localhost:4666/api/';
  //   }
  // }
  // URL de producción (DevTunnels o servidor real)
};

export const AppConfig = {
  apiBaseUrl: getBaseUrl(),
  apiTimeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'User-App',
  },
} as const;
