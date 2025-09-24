import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../../../../config/AppConfig';
import HttpClient from '../../HttpClient';
import UserBasicData from '../../../dtos/UserBasicData';
import { Observable, from, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { HttpResponse } from '../../../models/utils/HttpResponse';

export default class UserService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(AppConfig.apiBaseUrl);

    // Log de configuración para debugging
    console.log('UserService initialized with:', {
      baseUrl: AppConfig.apiBaseUrl,
    });
  }

  public getUserData(id: number): Observable<HttpResponse<UserBasicData>> {
    return this.httpClient
      .get<UserBasicData>(`/users/basic-info?id=${id}`)
      .pipe(
        tap(response => {
          console.log('UserService.getUserData - Success:', response);
        }),
        switchMap(response => {
          // Guardar datos en AsyncStorage
          return from(
            AsyncStorage.setItem('userData', JSON.stringify(response.data)),
          ).pipe(map(() => response));
        }),
        catchError(error => {
          console.error('UserService.getUserData - Error:', error);
          throw error;
        }),
      );
  }

  public getCurrentUser(): Observable<UserBasicData | null> {
    return from(AsyncStorage.getItem('userData')).pipe(
      map(data => {
        if (!data) return null;
        try {
          return JSON.parse(data) as UserBasicData;
        } catch {
          return null;
        }
      }),
      catchError(error => {
        console.error('Error getting current user:', error);
        return of(null);
      }),
    );
  }

  public updateUserData(
    userData: Partial<UserBasicData>,
  ): Observable<HttpResponse<UserBasicData>> {
    return this.httpClient.put<UserBasicData>('/users/profile', userData).pipe(
      tap(response => {
        console.log('UserService.updateUserData - Success:', response);
      }),
      switchMap(response => {
        // Actualizar datos en AsyncStorage
        return from(
          AsyncStorage.setItem('userData', JSON.stringify(response.data)),
        ).pipe(map(() => response));
      }),
      catchError(error => {
        console.error('UserService.updateUserData - Error:', error);
        throw error;
      }),
    );
  }

  public searchUsers(query: string): Observable<HttpResponse<UserBasicData[]>> {
    return this.httpClient
      .get<UserBasicData[]>(`/users/search?q=${encodeURIComponent(query)}`)
      .pipe(
        tap(response => {
          console.log('UserService.searchUsers - Success:', response);
        }),
        catchError(error => {
          console.error('UserService.searchUsers - Error:', error);
          throw error;
        }),
      );
  }
}
