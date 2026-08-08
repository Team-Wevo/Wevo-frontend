import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export type TeamReviewStatus = "PENDING" | "APPROVED" | "CHANGES_REQUESTED";

export interface TeamReviewItem {
  // 파생 PENDING 항목(검토 레코드가 없는 멤버)에는 내려오지 않는다.
  reviewId?: number;
  reviewerUserId: number;
  reviewerName: string;
  status: TeamReviewStatus;
  // CHANGES_REQUESTED일 때만 내려온다.
  changeRequestReason?: string;
  reviewedContentVersion?: number;
  resolved: boolean;
  // 본문이 수정되어 검토가 무효화됐는지 여부.
  outdated: boolean;
  reviewedAt?: string;
}

export interface TeamReviews {
  // 서버의 현재 본문 버전. 검토 제출 시 contentVersion으로 그대로 사용한다.
  currentContentVersion: number;
  // 검토 분모. OWNER를 제외한 MEMBER 수.
  totalMembers: number;
  approvedCount: number;
  changesRequestedCount: number;
  pendingCount: number;
  outdatedCount: number;
  // 위 배타 집계와 별개인 부분 집계. NO_UNRESOLVED_REQUEST 판정과 같은 기준이다.
  unresolvedChangesRequestedCount: number;
  items: TeamReviewItem[];
}

const TEAM_REVIEWS_FALLBACK_MESSAGE = "팀 검토 현황을 불러오지 못했습니다.";

/**
 * 섹션의 팀 검토 현황(집계 + 멤버별 목록)을 조회한다. (프로젝트 멤버 권한)
 *
 * 집계 4개(approved/changesRequested/pending/outdated)는 상호 배타이며 합이
 * totalMembers와 같다. outdated 항목은 원래 status와 무관하게 outdatedCount로만
 * 집계되고 나머지 셋에서 제외된다.
 */
export const getTeamReviews = async (
  sectionId: number,
): Promise<TeamReviews> => {
  const response = await apiClient.get<ApiResponse<TeamReviews>>(
    `/api/project-sections/${sectionId}/team-reviews`,
  );

  return unwrapApiResponse(response.data);
};

export const getTeamReviewsErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, TEAM_REVIEWS_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
