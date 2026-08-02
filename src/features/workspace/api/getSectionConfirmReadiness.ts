import { apiClient } from "../../../shared/api/client";
import type { ApiResponse } from "../../../shared/api/types";

// 섹션 확정 조건 key. 확정 API(C003) 실패 응답의 errors[].field와 동일한 체계다.
export type SectionConfirmCheckKey =
  | "SECTION_REVIEWING"
  | "AI_CHECK_CURRENT"
  | "MEMBER_APPROVED"
  | "NO_UNRESOLVED_REQUEST"
  | "NO_ACTIVE_EDITOR";

export interface SectionConfirmCheck {
  key: SectionConfirmCheckKey;
  satisfied: boolean;
  // 충족한 항목에는 내려오지 않는다.
  reason?: string;
}

export interface SectionConfirmReadiness {
  ready: boolean;
  canConfirm: boolean;
  checks: SectionConfirmCheck[];
}

/**
 * 섹션 확정 가능 여부를 조건 항목별로 조회한다. (프로젝트 멤버 권한)
 *
 * canConfirm은 ready && 호출자가 OWNER인 경우에만 true다.
 */
export const getSectionConfirmReadiness = async (
  sectionId: number,
): Promise<ApiResponse<SectionConfirmReadiness>> => {
  const response = await apiClient.get<ApiResponse<SectionConfirmReadiness>>(
    `/api/project-sections/${sectionId}/confirm-readiness`,
  );

  return response.data;
};

/** 미충족 항목의 사유 문구만 추린다. */
export const getUnsatisfiedReasons = (
  readiness: SectionConfirmReadiness | null,
): string[] => {
  if (!readiness) {
    return [];
  }

  return readiness.checks
    .filter((check) => !check.satisfied)
    .map((check) => check.reason)
    .filter((reason): reason is string => Boolean(reason));
};
