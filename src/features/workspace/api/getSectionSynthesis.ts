import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface SectionSynthesisIssueResponse {
  id?: string | number;
  type?: string;
  title?: string;
  summary?: string;
  aiHint?: string;
  question?: string;
  opinions?: Array<{
    memberName?: string;
    name?: string;
    content?: string;
    opinion?: string;
    text?: string;
  }>;
  options?: Array<{
    id?: string | number;
    label?: string;
    content?: string;
    text?: string;
    isCustomInput?: boolean;
  }>;
  decisionOptions?: Array<{
    id?: string | number;
    label?: string;
    content?: string;
    text?: string;
    isCustomInput?: boolean;
  }>;
  [key: string]: unknown;
}

export interface SectionSynthesisCurrentSetResponse {
  consensusSummary?: string;
  summary?: string;
  issues?: SectionSynthesisIssueResponse[];
  issueList?: SectionSynthesisIssueResponse[];
  currentSet?: SectionSynthesisIssueResponse[];
}

export interface SectionSynthesisResponse {
  exists?: boolean;
  synthesisStale?: boolean;
  latestJob?: {
    requestId?: string;
    status?: string;
  };
  currentSet?: SectionSynthesisCurrentSetResponse | null;
  current_set?: SectionSynthesisCurrentSetResponse | null;
  data?: SectionSynthesisCurrentSetResponse | null;
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
