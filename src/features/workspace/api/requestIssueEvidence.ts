import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface IssueEvidenceRequest {
  targetUserId: number;
}

interface IssueEvidenceResponse {
  issueId: number;
  requestedTo: {
    userId: number;
    name: string;
  };
}

const REQUEST_ISSUE_EVIDENCE_FALLBACK_MESSAGE =
  "추가 근거를 요청하지 못했습니다.";

export const requestIssueEvidence = async (
  issueId: number,
  request: IssueEvidenceRequest,
): Promise<IssueEvidenceResponse> => {
  const response = await apiClient.post<ApiResponse<IssueEvidenceResponse>>(
    `/api/issues/${issueId}/evidence-request`,
    request,
  );

  return unwrapApiResponse(response.data);
};

export const getRequestIssueEvidenceErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, REQUEST_ISSUE_EVIDENCE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
