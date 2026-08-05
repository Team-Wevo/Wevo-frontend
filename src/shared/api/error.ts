import { isAxiosError } from "axios";
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
  if (!isAxiosError(error)) {
    return null;
  }

  return isApiErrorResponse(error.response?.data) ? error.response.data : null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "요청 처리 중 오류가 발생했습니다.",
) => {
  const response = getApiErrorResponse(error);
  const reasons = response?.errors
    ?.map(({ reason }) => reason.trim())
    .filter(Boolean);

  if (reasons?.length) {
    return reasons.join(" ");
  }

  if (response?.message) {
    return response.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};
