import AsyncStorage from '@react-native-async-storage/async-storage';
import HttpClient from '../core/services/HttpClient';
import { AppConfig } from '../config/AppConfig';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpResponse } from '../core/models/utils/HttpResponse';

type AnyObj = Record<string, any>;

const httpClient = new HttpClient(AppConfig.apiBaseUrl);

function extractToken(res: AnyObj): string | null {
  if (typeof res?.token === 'string') return res.token;
  if (typeof res?.accessToken === 'string') return res.accessToken;
  if (typeof res?.data?.token === 'string') return res.data.token;
  if (typeof res?.data?.accessToken === 'string') return res.data.accessToken;
  return null;
}

export function login(
  userOrEmail: string,
  password: string,
): Observable<HttpResponse<AnyObj>> {
  return httpClient
    .post<AnyObj>('/users/login', { userOrEmail, password })
    .pipe(
      switchMap(response => {
        const token = extractToken(response.data);
        if (!token) {
          throw new Error('El backend no devolvió token');
        }

        // Guardar token y user data en AsyncStorage
        const promises: Promise<void>[] = [
          AsyncStorage.setItem('token', token),
        ];

        if (response.data.user) {
          promises.push(
            AsyncStorage.setItem('user', JSON.stringify(response.data.user)),
          );
        } else if (response.data.data?.user) {
          promises.push(
            AsyncStorage.setItem(
              'user',
              JSON.stringify(response.data.data.user),
            ),
          );
        }

        return from(Promise.all(promises)).pipe(map(() => response));
      }),
      tap(response => {
        console.log('Login successful:', response.status);
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      }),
    );
}

export function logout(): Observable<boolean> {
  const keysToRemove = [
    'token',
    'user',
    'userData',
    'userInfo',
    'authToken',
    'accessToken',
    'jwt',
    'userToken',
    'userLoginRes',
  ];

  return from(
    Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key))),
  ).pipe(
    map(() => true),
    catchError(error => {
      console.error('Logout error:', error);
      return of(false);
    }),
  );
}

export function getStoredToken(): Observable<string | null> {
  return from(AsyncStorage.getItem('token')).pipe(
    catchError(error => {
      console.error('Error getting stored token:', error);
      return of(null);
    }),
  );
}

export function isAuthenticated(): Observable<boolean> {
  return getStoredToken().pipe(map(token => token !== null));
}
