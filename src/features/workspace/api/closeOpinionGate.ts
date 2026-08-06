import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import type { WorkspaceSectionStatus } from "../constants/sections";

export interface OpinionGateCloseResponse {
  sectionId: number;
  sectionStatus: WorkspaceSectionStatus;
  closedAt: string;
}

const CLOSE_OPINION_GATE_FALLBACK_MESSAGE = "의견 수집 마감에 실패했습니다.";

/**
 * 의견 수집을 마감하고 AI 정리(SYNTHESIZING)를 시작한다. (OWNER 권한 필요)
 * 제출된 의견이 하나도 없거나 섹션이 COLLECTING 상태가 아니면 서버가 거부한다.
 */
export const closeOpinionGate = async (
  sectionId: number,
): Promise<OpinionGateCloseResponse> => {
  const response = await apiClient.post<ApiResponse<OpinionGateCloseResponse>>(
    `/api/project-sections/${sectionId}/opinion-gate/close`,
  );

  return unwrapApiResponse(response.data);
};

export const getCloseOpinionGateErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, CLOSE_OPINION_GATE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
