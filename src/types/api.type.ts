export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiListResponse<T> {
  success: boolean;
  message: string;
  meta: IPaginationMeta;
  data: T[];
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
