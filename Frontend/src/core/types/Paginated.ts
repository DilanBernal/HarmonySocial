export type Paginated<T> = {
  rows: T[];
  total: number;
  page: number;
  limit: number;
};
