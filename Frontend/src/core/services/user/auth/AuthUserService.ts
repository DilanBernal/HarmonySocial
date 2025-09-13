import ApiService from '../../general/ApiService';
import { AppConfig } from '../../../../config/AppConfig';
import { RegisterDTO } from '../../../dtos/RegisterDTO';

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
    console.log('AuthUserService.register - Data:', data);

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
}
