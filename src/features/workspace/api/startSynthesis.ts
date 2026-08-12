import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

interface StartSynthesisResponse {
  requestId: string;
}

const START_SYNTHESIS_FALLBACK_MESSAGE = "AI 의견 정리 시작에 실패했습니다.";

export const startSectionSynthesis = async (
  sectionId: number,
): Promise<StartSynthesisResponse> => {
  const response = await apiClient.post<ApiResponse<StartSynthesisResponse>>(
    `/api/project-sections/${sectionId}/synthesis`,
  );

  return unwrapApiResponse(response.data);
};

export const getStartSynthesisErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, START_SYNTHESIS_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
