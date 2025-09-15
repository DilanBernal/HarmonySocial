import ApiService from '../../general/ApiService';
import { AppConfig } from '../../../../config/AppConfig';
import { RegisterDTO } from '../../../dtos/RegisterDTO';
import LoginDTO from '../../../dtos/LoginDTO';
import LoginResponse from '../../../dtos/LoginResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      await AsyncStorage.setItem('user', JSON.stringify(response));

      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({
          profileImage: response.data.profile_image,
          username: response.data.username,
          id: response.data.id,
        }),
      );

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
}
