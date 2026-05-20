export interface BaseResponse<T> {
  Success: boolean;
  Message: string;
  Object: T | null;
  Errors: string[] | null;
}

export interface PaginatedResponse<T> {
  Success: boolean;
  Message: string;
  Object: T[];
  PageNumber: number;
  PageSize: number;
  TotalSize: number;
  Errors: null;
}

export const successResponse = <T>(message: string, obj: T | null = null): BaseResponse<T> => {
  return { Success: true, Message: message, Object: obj, Errors: null };
};

export const errorResponse = (message: string, errors: string[] | null = null): BaseResponse<null> => {
  return { Success: false, Message: message, Object: null, Errors: errors };
};

export const paginatedResponse = <T>(
  message: string,
  items: T[],
  pageNumber: number,
  pageSize: number,
  totalSize: number
): PaginatedResponse<T> => {
  return { Success: true, Message: message, Object: items, PageNumber: pageNumber, PageSize: pageSize, TotalSize: totalSize, Errors: null };
};
