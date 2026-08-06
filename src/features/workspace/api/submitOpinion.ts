import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface OpinionDraftResponse {
  id: number;
  content: string;
  updatedAt: string;
}

export interface OpinionSubmitResponse {
  id: number;
  submittedAt: string;
}

const SAVE_OPINION_DRAFT_FALLBACK_MESSAGE = "의견 임시저장에 실패했습니다.";
const SUBMIT_OPINION_FALLBACK_MESSAGE = "의견 제출에 실패했습니다.";

/**
 * 입력 중인 의견을 임시저장한다. 제출본(submit)은 그대로 유지된다.
 * "제출하기" 클릭 시 submit이 요청 본문을 받지 않으므로, 먼저 이 API로
 * 현재 텍스트를 서버에 반영한 뒤 submitOpinion을 호출해야 한다.
 */
export const saveOpinionDraft = async (
  sectionId: number,
  content: string,
): Promise<OpinionDraftResponse> => {
  const response = await apiClient.patch<ApiResponse<OpinionDraftResponse>>(
    `/api/project-sections/${sectionId}/my-opinion/draft`,
    { content },
  );

  return unwrapApiResponse(response.data);
};

export const getSaveOpinionDraftErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, SAVE_OPINION_DRAFT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};

/**
 * 임시저장된 의견을 제출한다. 요청 본문은 없으며, 임시저장된 내용이 20자
 * 미만이거나 아예 없으면 실패한다. 재제출 시 기존 제출본을 갱신한다.
 */
export const submitOpinion = async (
  sectionId: number,
): Promise<OpinionSubmitResponse> => {
  const response = await apiClient.post<ApiResponse<OpinionSubmitResponse>>(
    `/api/project-sections/${sectionId}/my-opinion/submit`,
  );

  return unwrapApiResponse(response.data);
};

export const getSubmitOpinionErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, SUBMIT_OPINION_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
