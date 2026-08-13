import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface SectionSynthesisIssueResponse {
  issueId: number;
  type: "CONFLICT" | "GAP";
  status: "PENDING" | "RESOLVED";
  description: string;
  question?: string;
  relatedOpinions: Array<{
    opinionId: number;
    authorUserId: number;
    authorName: string;
    excerpt: string;
  }>;
  options?: string[];
  decision?: {
    selectedOption?: string;
    customInput?: string;
    decidedAt: string;
  };
  evidenceRequested: boolean;
  answer?: {
    answerId: number;
    authorName: string;
    content: string;
    answeredAt: string;
  };
  [key: string]: unknown;
}

export interface SectionSynthesisCurrentSetResponse {
  setId?: string;
  consensusSummary: string;
  issues: SectionSynthesisIssueResponse[];
  inheritedGapAnswers?: Array<{
    issueId: number;
    answerId: number;
  }>;
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
