import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface SectionDraftPrecheckFinding {
  type: string;
  targetExcerpt: string;
  comment: string;
  suggestion?: string;
}

export interface SectionDraftPrecheckRewrite {
  content: string;
  changedCount: number;
}

export interface SectionDraftPrecheckCurrentResult {
  requestId?: string;
  resultId: string;
  checkedContentVersion: number;
  findings: SectionDraftPrecheckFinding[];
  rewrite?: SectionDraftPrecheckRewrite;
  rewriteApplied: boolean;
}

export interface SectionDraftPrecheckResponse {
  exists: boolean;
  aiCheckStatus?: string;
  latestJob?: {
    requestId?: string;
    status?: string;
  };
  currentResult?: SectionDraftPrecheckCurrentResult;
}

const GET_DRAFT_PRECHECK_FALLBACK_MESSAGE =
  "AI 사전 검토 결과를 불러오지 못했습니다.";

export const getSectionDraftPrecheck = async (
  sectionId: number,
): Promise<SectionDraftPrecheckResponse> => {
  const response = await apiClient.get<
    ApiResponse<SectionDraftPrecheckResponse>
  >(`/api/project-sections/${sectionId}/precheck`);

  return unwrapApiResponse(response.data);
};

export const getSectionDraftPrecheckErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GET_DRAFT_PRECHECK_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
