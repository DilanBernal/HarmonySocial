import { Platform } from 'react-native';

const getBaseUrl = () => {
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
