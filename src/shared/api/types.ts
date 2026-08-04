export interface FieldError {
  field: string;
  reason: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  errors: FieldError[] | null;
  timestamp: string;
}
