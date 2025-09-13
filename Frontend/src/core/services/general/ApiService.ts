import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AppConfig } from '../../../config/AppConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    let axiosConfig: any = {
      baseURL: AppConfig.apiBaseUrl,
      timeout: AppConfig.apiTimeout,
      headers: AppConfig.headers,
    };

    this.api = axios.create(axiosConfig);

    this.api.interceptors.request.use(
      async config => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async error => {
        if (error.response?.status === 401) {
          // Token expirado, limpiar storage y redirigir al login
          await AsyncStorage.removeItem('authToken');
          // Aquí podrías usar navigation para redirigir al login
        }
        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data: object): Promise<T> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: object): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }
}

export default new ApiService();
