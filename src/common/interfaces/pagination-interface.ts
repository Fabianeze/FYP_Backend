export interface IPaginateMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  count: number;
}

export interface IPaginateResult<T> {
  data: T[];
  meta: IPaginateMeta;
}

export interface IOptions {
  limit: number;
  page: number;
}

export interface IMetaProps {
  data: any[];
  limit: number;
  total: number;
  page: number;
}
