import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import type { WorkspaceSectionStatus } from "../constants/sections";

export interface RequestReviewResponse {
  sectionId: number;
  sectionStatus: WorkspaceSectionStatus;
}

const REQUEST_REVIEW_FALLBACK_MESSAGE = "검토 요청에 실패했습니다.";

/**
 * 초안을 검토 요청 상태로 전환한다. (DRAFTING → REVIEWING)
 * 서버가 초안 존재 여부·현재 상태·동시 편집 여부를 재검증하므로,
 * 조건을 화면에서 미리 막지 않고 실패 응답을 그대로 안내한다.
 */
export const requestReview = async (
  sectionId: number,
): Promise<RequestReviewResponse> => {
  const response = await apiClient.post<ApiResponse<RequestReviewResponse>>(
    `/api/project-sections/${sectionId}/review-request`,
  );

  return unwrapApiResponse(response.data);
};

export const getRequestReviewErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, REQUEST_REVIEW_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
