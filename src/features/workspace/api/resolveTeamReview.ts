import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface ResolveTeamReviewPayload {
  // true = 해소 처리, false = 해소 취소(실수 복구용)
  resolved: boolean;
}

const RESOLVE_TEAM_REVIEW_FALLBACK_MESSAGE = "수정 요청 처리에 실패했습니다.";

/**
 * 수정 요청을 해소 처리한다. (OWNER 전용)
 *
 * 본문을 고치지 않고 대화로 합의한 경우에 사용한다. 검토 status는
 * CHANGES_REQUESTED로 남고 unresolvedChangesRequestedCount만 줄어들며,
 * 이 값이 확정 조건 NO_UNRESOLVED_REQUEST가 보는 기준이다.
 */
export const resolveTeamReview = async (
  sectionId: number,
  reviewId: number,
  payload: ResolveTeamReviewPayload,
): Promise<void> => {
  const response = await apiClient.patch<ApiResponse<void>>(
    `/api/project-sections/${sectionId}/team-reviews/${reviewId}`,
    payload,
  );

  unwrapApiResponse(response.data);
};

export const getResolveTeamReviewErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, RESOLVE_TEAM_REVIEW_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
