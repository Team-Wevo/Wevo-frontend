import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

const DELETE_PROJECT_FALLBACK_MESSAGE = "프로젝트 삭제에 실패했습니다.";

export const deleteProject = async (projectId: number): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null> | "">(
    `/api/projects/${projectId}`,
  );

  // 204 No Content 등 본문 없는 성공 응답은 그대로 성공으로 처리한다.
  if (response.data) {
    unwrapApiResponse(response.data);
  }
};

export const getDeleteProjectErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, DELETE_PROJECT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
