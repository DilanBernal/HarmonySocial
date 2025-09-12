import { Platform } from 'react-native';

// Para Android, necesitamos usar 10.0.2.2 en lugar de localhost en el emulador
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return __DEV__
      ? 'https://fs571vhd-4666.use2.devtunnels.ms/api'
      : 'https://fs571vhd-4666.use2.devtunnels.ms/api';
  }
  return 'https://fs571vhd-4666.use2.devtunnels.ms/api';
};

export const AppConfig = {
  apiBaseUrl: getBaseUrl(),
  apiTimeout: parseInt('10000', 10),
  environment: 'development',
  encryptionKey: 'asdflaksdjf;aldsfhjlaiksdjhfasd',
} as const;

// Validación de configuración requerida
const validateConfig = () => {
  const required = ['API_BASE_URL'];
};

validateConfig();
