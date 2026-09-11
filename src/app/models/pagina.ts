export interface Pagina<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  number: number;
  size: number;
  numberOfElements: number;
}