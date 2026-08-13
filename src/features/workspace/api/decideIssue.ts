import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface IssueDecisionRequest {
  selectedOption?: string;
  customInput?: string;
}

interface IssueDecisionResponse {
  issueId: number;
  status: "PENDING" | "RESOLVED";
}

const DECIDE_ISSUE_FALLBACK_MESSAGE = "쟁점 결정 저장에 실패했습니다.";

export const decideIssue = async (
  issueId: number,
  request: IssueDecisionRequest,
): Promise<IssueDecisionResponse> => {
  const response = await apiClient.post<ApiResponse<IssueDecisionResponse>>(
    `/api/issues/${issueId}/decision`,
    request,
  );

  return unwrapApiResponse(response.data);
};

export const getDecideIssueErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, DECIDE_ISSUE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
