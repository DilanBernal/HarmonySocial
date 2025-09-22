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
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private handleResponse<T>(response: Response): Observable<HttpResponse<T>> {
    return from(response.json()).pipe(
      map(data => ({
        data,
        status: response.status,
        statusText: response.statusText,
      })),
      catchError(error => {
        if (!response.ok) {
          return throwError(() => ({
            message: `HTTP Error ${response.status}`,
            status: response.status,
            data: error,
          }));
        }
        return throwError(() => ({
          message: 'Error parsing response',
          data: error,
        }));
      }),
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
