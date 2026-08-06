import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

// 서버의 섹션 상태 값. 프론트 목 데이터의 WorkspaceSectionStatus와 별개로 관리한다.
export type ProjectSectionStatus = "REVIEWING" | "CONFIRMED";

export interface ConfirmSectionResponse {
  sectionId: number;
  sectionStatus: ProjectSectionStatus;
  confirmedVersion: number;
}

const CONFIRM_SECTION_FALLBACK_MESSAGE = "섹션 확정에 실패했습니다.";

/**
 * 섹션을 확정한다. (OWNER 권한 필요)
 *
 * 확정 조건(SECTION_REVIEWING / AI_CHECK_CURRENT / MEMBER_APPROVED /
 * NO_UNRESOLVED_REQUEST / NO_ACTIVE_EDITOR)은 서버가 재검증하므로,
 * 조건을 화면에서 미리 막지 않고 실패 응답을 그대로 안내한다.
 */
export const confirmSection = async (
  sectionId: number,
): Promise<ConfirmSectionResponse> => {
  const response = await apiClient.post<ApiResponse<ConfirmSectionResponse>>(
    `/api/project-sections/${sectionId}/confirm`,
  );

  return unwrapApiResponse(response.data);
};

/**
 * 확정 실패 응답에서 사용자에게 보여줄 문구를 만든다.
 * 확정 조건 미충족(C003)인 경우 errors[]의 사유를 우선 사용한다.
 */
export const getConfirmSectionErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, CONFIRM_SECTION_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
