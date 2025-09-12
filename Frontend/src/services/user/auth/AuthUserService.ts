import { AppConfig } from '../../../config/AppConfig';
import { RegisterDTO } from '../../../models/RegisterDTO';
import axios, { AxiosResponse } from 'axios';

export class AuthUserService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = AppConfig.apiBaseUrl;
    console.log(this.baseUrl);
    this.timeout = AppConfig.apiTimeout;

    // Log de configuración para debugging
    console.log('AuthUserService initialized with:', {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
    });
  }

  async register(data: RegisterDTO): Promise<AxiosResponse<any>> {
    console.log(
      'AuthUserService.register - Sending request to:',
      `${this.baseUrl}/users/register`,
    );
    console.log('AuthUserService.register - Data:', data);

    try {
      const response = await axios.post(
        `${this.baseUrl}/users/register`,
        data,
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('AuthUserService.register - Success:', response.status);
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
