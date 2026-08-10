import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface MyOpinionResponse {
  exists: boolean;
  id: number | null;
  content: string;
  status: string | null;
  hasUnsubmittedChanges: boolean;
  submittedAt: string | null;
  updatedAt: string | null;
}

const GET_MY_OPINION_FALLBACK_MESSAGE = "내 작업본을 불러오지 못했습니다.";

// 내 작업본 조회 — 임시저장/제출 여부와 상관없이 지금까지 작성한 내용을 그대로 내려준다.
export const getMyOpinion = async (
  sectionId: number,
): Promise<MyOpinionResponse> => {
  const response = await apiClient.get<ApiResponse<MyOpinionResponse>>(
    `/api/project-sections/${sectionId}/my-opinion`,
  );

  return unwrapApiResponse(response.data);
};

export const getMyOpinionErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GET_MY_OPINION_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
