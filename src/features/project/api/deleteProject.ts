import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";

const DELETE_PROJECT_FALLBACK_MESSAGE = "프로젝트 삭제에 실패했습니다.";

// 스웨거 명세상 성공 시 204 No Content(본문 없음)를 반환한다. OWNER 권한 필요,
// 실제로는 하드 삭제가 아니라 ARCHIVED로 상태 변경되며 목록 조회에서 제외된다.
export const deleteProject = async (projectId: number): Promise<void> => {
  await apiClient.delete(`/api/projects/${projectId}`);
};

export const getDeleteProjectErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, DELETE_PROJECT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
