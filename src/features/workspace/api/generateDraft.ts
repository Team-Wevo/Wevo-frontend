import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

interface GenerateDraftResponse {
  requestId: string;
}

const GENERATE_DRAFT_FALLBACK_MESSAGE = "초안 생성 시작에 실패했습니다.";

export const generateSectionDraft = async (
  sectionId: number,
): Promise<GenerateDraftResponse> => {
  const response = await apiClient.post<ApiResponse<GenerateDraftResponse>>(
    `/api/project-sections/${sectionId}/draft/generate`,
  );

  return unwrapApiResponse(response.data);
};

export const getGenerateDraftErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GENERATE_DRAFT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
