import type { ApiErrorResponse, ApiResponse } from "./types";

export class ApiResponseError extends Error {
  readonly response: ApiErrorResponse;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiResponseError";
    this.response = response;
  }
}

export const unwrapApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new ApiResponseError(response);
  }

  return response.data;
};
