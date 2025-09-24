import HttpClient from '../../HttpClient';
import { AppConfig } from '../../../../config/AppConfig';
import { RegisterDTO } from '../../../dtos/RegisterDTO';
import LoginDTO from '../../../dtos/LoginDTO';
import LoginResponse from '../../../dtos/LoginResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../user/UserService';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { HttpResponse } from '../../../models/utils/HttpResponse';

export class AuthUserService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(AppConfig.apiBaseUrl);

    // Log de configuración para debugging
    console.log('AuthUserService initialized with:', {
      baseUrl: AppConfig.apiBaseUrl,
    });
  }

  register(data: RegisterDTO): Observable<HttpResponse<any>> {
    console.log('AuthUserService.register - Starting registration');

    return this.httpClient.post<any>('/users/register', data).pipe(
      tap(response => {
        console.log('AuthUserService.register - Success:', response.status);
      }),
      catchError(error => {
        console.error('AuthUserService.register - Error:', error);
        throw error;
      }),
    );
  }

  login(data: LoginDTO): Observable<HttpResponse<LoginResponse>> {
    console.log('AuthUserService.login - Starting login');

    return this.httpClient.post<LoginResponse>('/users/login', data).pipe(
      switchMap(response => {
        console.log('Login response:', response.data);

        // Guardar datos de usuario y token
        return from(this.saveLoginData(response.data)).pipe(
          switchMap(() => {
            // Obtener datos adicionales del usuario
            const userService = new UserService();
            return from(userService.getUserData(response.data.data.id)).pipe(
              map(() => response), // Retornar la respuesta original
              catchError(userError => {
                console.warn('Failed to get additional user data:', userError);
                return of(response); // Continuar con la respuesta original si falla
              }),
            );
          }),
        );
      }),
      catchError(error => {
        console.error('AuthUserService.login - Error:', error);
        throw error;
      }),
    );
  }

  private async saveLoginData(loginResponse: LoginResponse): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify(loginResponse)),
        AsyncStorage.setItem('userLoginRes', JSON.stringify(loginResponse)),
        AsyncStorage.setItem('token', loginResponse.data.token),
      ]);
    } catch (error) {
      console.error('Error saving login data:', error);
      throw error;
    }
  }

  /** Intenta recuperar el JWT desde AsyncStorage probando varias claves y formatos. */
  getToken(): Observable<string | null> {
    return from(this.getTokenAsync());
  }

  private async getTokenAsync(): Promise<string | null> {
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

  logout(): Observable<boolean> {
    return from(this.clearAuthData()).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error during logout:', error);
        return of(false);
      }),
    );
  }

  private async clearAuthData(): Promise<void> {
    const keys = [
      'token',
      'userData',
      'userInfo',
      'authToken',
      'accessToken',
      'jwt',
      'userToken',
      'user',
      'userLoginRes',
    ];

    await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
  }

  isAuthenticated(): Observable<boolean> {
    return this.getToken().pipe(map(token => token !== null));
  }
}
