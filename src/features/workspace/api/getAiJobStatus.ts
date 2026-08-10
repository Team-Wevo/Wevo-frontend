import { apiClient } from "../../../shared/api/client";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export type AiJobStatus = "REQUESTED" | "SUCCEEDED" | "FAILED";

export interface AiJobStatusResponse {
  requestId: string;
  status: AiJobStatus;
  feature?: string;
}

export const getAiJobStatus = async (
  requestId: string,
): Promise<AiJobStatusResponse> => {
  const response = await apiClient.get<ApiResponse<AiJobStatusResponse>>(
    `/api/ai-jobs/${requestId}`,
  );

  return unwrapApiResponse(response.data);
};
