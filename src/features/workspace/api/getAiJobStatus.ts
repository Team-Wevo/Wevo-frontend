import { apiClient } from "../../../shared/api/client";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export type AiJobStatus = "REQUESTED" | "SUCCEEDED" | "FAILED";

export interface AiJobStatusResponse {
  requestId: string;
  status: AiJobStatus;
  feature?: string;
  failure?: {
    errorCode?: string;
    message?: string;
  };
}

const toRecord = (value: unknown): Record<string, unknown> => {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
};

const pickFirstString = (...values: unknown[]): string | null => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
};

const normalizeAiJobStatus = (status: unknown): AiJobStatus => {
  if (typeof status !== "string") {
    return "REQUESTED";
  }

  const normalized = status.trim().toUpperCase();

  switch (normalized) {
    case "REQUESTED":
    case "PENDING":
    case "QUEUED":
    case "RUNNING":
    case "IN_PROGRESS":
    case "PROCESSING":
    case "WAITING":
    case "CREATED":
      return "REQUESTED";
    case "SUCCEEDED":
    case "SUCCESS":
    case "COMPLETED":
    case "DONE":
    case "FINISHED":
      return "SUCCEEDED";
    case "FAILED":
    case "ERROR":
    case "ERRORED":
    case "CANCELLED":
    case "CANCELED":
      return "FAILED";
    default:
      return "REQUESTED";
  }
};

const extractStatusFromCode = (code: unknown): AiJobStatus | null => {
  if (typeof code !== "string") {
    return null;
  }

  const normalizedCode = code.trim().toUpperCase();

  if (
    normalizedCode.includes("FAILED") ||
    normalizedCode.includes("ERROR") ||
    normalizedCode.includes("CANCEL")
  ) {
    return "FAILED";
  }

  if (
    normalizedCode.includes("SUCCEEDED") ||
    normalizedCode.includes("SUCCESS") ||
    normalizedCode.includes("COMPLETED") ||
    normalizedCode.includes("DONE")
  ) {
    return "SUCCEEDED";
  }

  if (
    normalizedCode.includes("REQUESTED") ||
    normalizedCode.includes("PENDING") ||
    normalizedCode.includes("RUNNING") ||
    normalizedCode.includes("PROCESSING") ||
    normalizedCode.includes("QUEUE")
  ) {
    return "REQUESTED";
  }

  return null;
};

export const getAiJobStatus = async (
  requestId: string,
): Promise<AiJobStatusResponse> => {
  const response = await apiClient.get<ApiResponse<AiJobStatusResponse>>(
    `/api/ai-jobs/${requestId}`,
  );

  const payload = unwrapApiResponse(response.data);
  const payloadRecord = toRecord(payload);
  const jobRecord = toRecord(payloadRecord.job);
  const resultRecord = toRecord(payloadRecord.result);

  const rawStatus = pickFirstString(
    payloadRecord.status,
    payloadRecord.jobStatus,
    payloadRecord.state,
    jobRecord.status,
    jobRecord.jobStatus,
    jobRecord.state,
    resultRecord.status,
    resultRecord.state,
  );

  const normalizedStatusFromCode = extractStatusFromCode(response.data.code);

  return {
    requestId:
      pickFirstString(payloadRecord.requestId, jobRecord.requestId) ??
      requestId,
    status:
      (rawStatus ? normalizeAiJobStatus(rawStatus) : null) ??
      normalizedStatusFromCode ??
      "REQUESTED",
    feature:
      pickFirstString(payloadRecord.feature, jobRecord.feature) ?? undefined,
    failure: toRecord(payloadRecord.failure),
  };
};
