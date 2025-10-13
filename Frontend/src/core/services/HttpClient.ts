import { HttpError } from '../models/utils/HttpError';
import { HttpResponse } from '../models/utils/HttpResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observable, from, throwError, of } from 'rxjs';
import { map, catchError, switchMap, timeout, retry } from 'rxjs/operators';

export default class HttpClient {
  private baseURL: string;
  private defaultTimeout: number = 10000;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private handleResponse<T>(response: Response): Observable<HttpResponse<T>> {
    if (!response.ok) {
      return from(response.text()).pipe(
        switchMap(errorText => {
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = errorText;
          }
          return throwError(() => ({
            message: `HTTP Error ${response.status}`,
            status: response.status,
            data: errorData,
          }));
        }),
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return of({
        data: undefined as T,
        status: response.status,
        statusText: response.statusText,
      });
    }

    // Try to parse as JSON, fallback to text
    return from(response.text()).pipe(
      map(text => {
        let data: T;
        try {
          data = text ? JSON.parse(text) : undefined;
        } catch {
          data = text as unknown as T;
        }
        return {
          data,
          status: response.status,
          statusText: response.statusText,
        };
      }),
      catchError(error =>
        throwError(() => ({
          message: 'Error parsing response',
          data: error,
        })),
      ),
    );
  }

  get<T>(endpoint: string): Observable<HttpResponse<T>> {
    return from(this.getHeaders()).pipe(
      switchMap(headers =>
        from(
          fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers,
          }),
        ),
      ),
      switchMap(response => this.handleResponse<T>(response)),
      timeout(this.defaultTimeout),
      retry(2),
      catchError(error => throwError(() => this.mapError(error))),
    );
  }

  post<T>(endpoint: string, body?: any): Observable<HttpResponse<T>> {
    return from(this.getHeaders()).pipe(
      switchMap(headers =>
        from(
          fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers,
            body: body ? JSON.stringify(body) : undefined,
          }),
        ),
      ),
      switchMap(response => this.handleResponse<T>(response)),
      timeout(this.defaultTimeout),
      catchError(error => throwError(() => this.mapError(error))),
    );
  }

  put<T>(endpoint: string, body?: any): Observable<HttpResponse<T>> {
    return from(this.getHeaders()).pipe(
      switchMap(headers =>
        from(
          fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: body ? JSON.stringify(body) : undefined,
          }),
        ),
      ),
      switchMap(response => this.handleResponse<T>(response)),
      timeout(this.defaultTimeout),
      catchError(error => throwError(() => this.mapError(error))),
    );
  }

  delete<T>(endpoint: string): Observable<HttpResponse<T>> {
    return from(this.getHeaders()).pipe(
      switchMap(headers =>
        from(
          fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers,
          }),
        ),
      ),
      switchMap(response => this.handleResponse<T>(response)),
      timeout(this.defaultTimeout),
      catchError(error => throwError(() => this.mapError(error))),
    );
  }

  private mapError(error: any): HttpError {
    if (error.name === 'TimeoutError') {
      return { message: 'Request timeout' };
    }

    if (error.status) {
      return {
        message: error.message || 'HTTP Error',
        status: error.status,
        data: error.data,
      };
    }

    return {
      message: error.message || 'Network error',
    };
  }
}
