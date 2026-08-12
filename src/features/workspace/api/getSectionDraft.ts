import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface SectionDraftResponse {
  content: string;
  contentVersion: number;
  activeEditor: {
    userId: number;
    name: string;
  } | null;
  updatedAt: string;
}

const GET_DRAFT_FALLBACK_MESSAGE = "생성된 초안을 불러오지 못했습니다.";

export const getSectionDraft = async (
  sectionId: number,
): Promise<SectionDraftResponse> => {
  const response = await apiClient.get<ApiResponse<SectionDraftResponse>>(
    `/api/project-sections/${sectionId}/draft`,
  );

  return unwrapApiResponse(response.data);
};

export const getSectionDraftErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GET_DRAFT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
