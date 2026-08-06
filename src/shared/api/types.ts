export interface FieldError {
  field: string;
  reason: string;
}

interface ApiResponseBase {
  code: string;
  message: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> extends ApiResponseBase {
  success: true;
  data: T;
  errors?: null;
}

export interface ApiErrorResponse extends ApiResponseBase {
  success: false;
  data?: null;
  errors?: FieldError[] | null;
}

/**
 * Wevo API의 공통 JSON 응답 구조.
 *
 * 오류 응답은 실제 서버에서 data와 errors를 생략할 수 있으므로 성공/실패를
 * success 필드로 구분한다.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
