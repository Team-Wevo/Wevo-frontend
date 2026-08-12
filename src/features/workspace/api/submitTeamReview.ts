import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

// 제출 가능한 검토 결과. 조회 응답의 PENDING은 미검토 상태라 제출할 수 없다.
export type SubmitTeamReviewStatus = "APPROVED" | "CHANGES_REQUESTED";

export const CHANGE_REQUEST_REASON_MAX_LENGTH = 1000;

export interface SubmitTeamReviewPayload {
  status: SubmitTeamReviewStatus;
  // CHANGES_REQUESTED면 필수.
  changeRequestReason?: string;
  // 검토 화면이 표시 중인 본문 버전. 조회 응답의 currentContentVersion을 그대로 보낸다.
  contentVersion: number;
}

const SUBMIT_TEAM_REVIEW_FALLBACK_MESSAGE = "검토 제출에 실패했습니다.";

/**
 * 현재 본문 버전에 대한 내 검토를 제출한다. (MEMBER 전용, upsert)
 *
 * 팀장(OWNER)은 검토자가 아니라 확정 실행자이므로 호출하면 403이다.
 * contentVersion이 서버 현재 버전과 다르면 409로 거부되며, 이는 본문을 다시 읽고
 * 재검토해야 한다는 뜻이다.
 */
export const submitTeamReview = async (
  sectionId: number,
  payload: SubmitTeamReviewPayload,
): Promise<void> => {
  const response = await apiClient.put<ApiResponse<void>>(
    `/api/project-sections/${sectionId}/team-reviews/me`,
    payload,
  );

  unwrapApiResponse(response.data);
};

export const getSubmitTeamReviewErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, SUBMIT_TEAM_REVIEW_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
