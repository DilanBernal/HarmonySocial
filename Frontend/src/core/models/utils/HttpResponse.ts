export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
}
