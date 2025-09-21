import ApiService from '../../general/ApiService';
import { AppConfig } from '../../../../config/AppConfig';
import { RegisterDTO } from '../../../dtos/RegisterDTO';
import LoginDTO from '../../../dtos/LoginDTO';
import LoginResponse from '../../../dtos/LoginResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../user/UserService';

export class AuthUserService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = AppConfig.apiBaseUrl;
    this.timeout = AppConfig.apiTimeout;

    // Log de configuración para debugging
    console.log('AuthUserService initialized with:', {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
    });
  }

  async register(data: RegisterDTO): Promise<any> {
    try {
      const response = await ApiService.post('users/register', data);
      // console.log('AuthUserService.register - Success:', response.status);
      return response;
    } catch (error: any) {
      console.error('AuthUserService.register - Error:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });

      throw error;
    }
  }

  async login(data: LoginDTO): Promise<LoginResponse> {
    try {
      const response = await ApiService.post<LoginResponse>(
        'users/login',
        data,
      );
      console.log(response.data.id);

      const userService = new UserService();
      console.log(response);

      await AsyncStorage.setItem('user', JSON.stringify(response));

      // console.log(
      await userService.getUserData(response.data.id);

      await AsyncStorage.setItem('userLoginRes', JSON.stringify(response));

      await AsyncStorage.setItem('token', response.data.token);

      return response;
    } catch (error: any) {
      console.error('AuthUserService.Login - Error:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });

      throw error;
    }
  }

  /** Intenta recuperar el JWT desde AsyncStorage probando varias claves y formatos. */
  async getToken(): Promise<string | null> {
    const keys = [
      'token',
      'userData',
      'userInfo',
      'authToken',
      'accessToken',
      'jwt',
      'userToken',
    ];
    for (const k of keys) {
      const raw = await AsyncStorage.getItem(k);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'string') return parsed;
        if (parsed?.token) return String(parsed.token);
        if (parsed?.accessToken) return String(parsed.accessToken);
      } catch {
        return raw; // ya era string plano
      }
    }
    return null;
  }
}
