import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface IssueAnswerRequest {
  content: string;
}

interface IssueAnswerResponse {
  issueId: number;
  answerId: number;
  answeredAt: string;
}

const ANSWER_ISSUE_FALLBACK_MESSAGE = "추가 근거 답변을 등록하지 못했습니다.";

export const answerIssue = async (
  issueId: number,
  request: IssueAnswerRequest,
): Promise<IssueAnswerResponse> => {
  const response = await apiClient.post<ApiResponse<IssueAnswerResponse>>(
    `/api/issues/${issueId}/answers`,
    request,
  );

  return unwrapApiResponse(response.data);
};

export const getAnswerIssueErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, ANSWER_ISSUE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
