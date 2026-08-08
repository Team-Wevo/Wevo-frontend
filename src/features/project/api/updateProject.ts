import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface UpdateProjectRequest {
  title: string;
}

export interface UpdateProjectResponse {
  projectId: number;
  title: string;
}

const UPDATE_PROJECT_FALLBACK_MESSAGE = "프로젝트 이름 수정에 실패했습니다.";

export const updateProject = async (
  projectId: number,
  payload: UpdateProjectRequest,
): Promise<UpdateProjectResponse> => {
  const response = await apiClient.patch<ApiResponse<UpdateProjectResponse>>(
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
