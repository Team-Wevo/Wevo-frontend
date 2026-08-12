import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface ApplySectionDraftPrecheckRequest {
  requestId: string;
  checkedContentVersion: number;
}

const APPLY_DRAFT_PRECHECK_FALLBACK_MESSAGE = "수정안 적용에 실패했습니다.";

export const applySectionDraftPrecheck = async (
  sectionId: number,
  payload: ApplySectionDraftPrecheckRequest,
) => {
  const response = await apiClient.post<ApiResponse<null>>(
    `/api/project-sections/${sectionId}/precheck/apply`,
    payload,
  );

  return unwrapApiResponse(response.data);
};

export const getApplySectionDraftPrecheckErrorMessage = (
  error: unknown,
): string => {
  return getApiErrorMessage(error, APPLY_DRAFT_PRECHECK_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
