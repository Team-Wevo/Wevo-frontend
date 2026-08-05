import { isAxiosError } from "axios";
import { apiClient } from "../../../shared/api/client";
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
): Promise<ApiResponse<OpinionGateCloseResponse>> => {
  const response = await apiClient.post<ApiResponse<OpinionGateCloseResponse>>(
    `/api/project-sections/${sectionId}/opinion-gate/close`,
  );

  return response.data;
};

export const getCloseOpinionGateErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return CLOSE_OPINION_GATE_FALLBACK_MESSAGE;
  }

  const errorResponse = error.response?.data as
    ApiResponse<unknown> | undefined;

  const reasons =
    errorResponse?.errors?.map((fieldError) => fieldError.reason) ?? [];

  const text =
    reasons.length > 0
      ? reasons.join(" ")
      : (errorResponse?.message ?? CLOSE_OPINION_GATE_FALLBACK_MESSAGE);

  return errorResponse?.code ? `${text} (${errorResponse.code})` : text;
};
