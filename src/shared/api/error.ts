import { isAxiosError } from "axios";
import { ApiResponseError } from "./response";
import type { ApiErrorResponse } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  isRecord(value) &&
  value.success === false &&
  typeof value.code === "string" &&
  typeof value.message === "string" &&
  typeof value.timestamp === "string";

export const getApiErrorResponse = (
  error: unknown,
): ApiErrorResponse | null => {
  if (error instanceof ApiResponseError) {
    return error.response;
  }

  if (!isAxiosError(error)) {
    return null;
  }

  return isApiErrorResponse(error.response?.data) ? error.response.data : null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "요청 처리 중 오류가 발생했습니다.",
  options: { includeCode?: boolean } = {},
) => {
  const response = getApiErrorResponse(error);
  const reasons = response?.errors
    ?.map(({ reason }) => reason.trim())
    .filter(Boolean);

  const message = reasons?.length
    ? reasons.join(" ")
    : (response?.message ??
      (error instanceof Error && error.message
        ? error.message
        : fallbackMessage));

  return options.includeCode && response?.code
    ? `${message} (${response.code})`
    : message;
};
