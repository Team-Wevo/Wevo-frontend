import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import type { WorkspaceSectionStatus } from "../constants/sections";

export interface SaveSectionDraftRequest {
  content: string;
  baseVersion: number;
}

export interface SaveSectionDraftResponse {
  contentVersion: number;
  updatedAt: string;
  sectionStatus: WorkspaceSectionStatus;
  driftedSections: number[];
}

const SAVE_DRAFT_FALLBACK_MESSAGE = "초안 저장에 실패했습니다.";

export const saveSectionDraft = async (
  sectionId: number,
  payload: SaveSectionDraftRequest,
): Promise<SaveSectionDraftResponse> => {
  const response = await apiClient.put<ApiResponse<SaveSectionDraftResponse>>(
    `/api/project-sections/${sectionId}/draft`,
    payload,
  );

  return unwrapApiResponse(response.data);
};

export const getSaveSectionDraftErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, SAVE_DRAFT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
