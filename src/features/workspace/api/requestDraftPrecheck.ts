import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

interface DraftPrecheckResponse {
  requestId: string;
}

const REQUEST_DRAFT_PRECHECK_FALLBACK_MESSAGE =
  "AI 사전 검토 요청에 실패했습니다.";

export const requestSectionDraftPrecheck = async (
  sectionId: number,
): Promise<DraftPrecheckResponse> => {
  const response = await apiClient.post<ApiResponse<DraftPrecheckResponse>>(
    `/api/project-sections/${sectionId}/precheck`,
  );

  return unwrapApiResponse(response.data);
};

export const getRequestSectionDraftPrecheckErrorMessage = (
  error: unknown,
): string => {
  return getApiErrorMessage(error, REQUEST_DRAFT_PRECHECK_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
