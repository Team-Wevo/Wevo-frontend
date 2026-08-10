import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface SectionSynthesisIssueResponse {
  id?: string | number;
  type?: string;
  title?: string;
  aiHint?: string;
  opinions?: Array<{
    memberName?: string;
    name?: string;
    content?: string;
  }>;
  options?: Array<{
    id?: string | number;
    label?: string;
    isCustomInput?: boolean;
  }>;
  [key: string]: unknown;
}

export interface SectionSynthesisCurrentSetResponse {
  consensusSummary?: string;
  issues?: SectionSynthesisIssueResponse[];
}

export interface SectionSynthesisResponse {
  currentSet: SectionSynthesisCurrentSetResponse | null;
}

const GET_SYNTHESIS_FALLBACK_MESSAGE =
  "AI 의견 정리 결과를 불러오지 못했습니다.";

export const getSectionSynthesis = async (
  sectionId: number,
): Promise<SectionSynthesisResponse> => {
  const response = await apiClient.get<ApiResponse<SectionSynthesisResponse>>(
    `/api/project-sections/${sectionId}/synthesis`,
  );

  return unwrapApiResponse(response.data);
};

export const getSectionSynthesisErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GET_SYNTHESIS_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
