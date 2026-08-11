import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import type { ProjectDetailResponse } from "./getProjectDetail";

// title(최대 200자)·description(최대 2,000자)만 수정 가능 — 둘 다 선택적 부분 수정(PATCH)
export interface UpdateProjectRequest {
  title?: string;
  description?: string;
}

const UPDATE_PROJECT_FALLBACK_MESSAGE = "프로젝트 수정에 실패했습니다.";

export const updateProject = async (
  projectId: number,
  payload: UpdateProjectRequest,
): Promise<ProjectDetailResponse> => {
  const response = await apiClient.patch<ApiResponse<ProjectDetailResponse>>(
    `/api/projects/${projectId}`,
    payload,
  );

  return unwrapApiResponse(response.data);
};

export const getUpdateProjectErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, UPDATE_PROJECT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
