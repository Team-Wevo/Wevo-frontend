import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface CreateInviteLinkResponse {
  token: string;
  inviteUrl: string;
}

const CREATE_INVITE_LINK_FALLBACK_MESSAGE = "초대 링크 생성에 실패했습니다.";

/**
 * 프로젝트 초대 링크를 생성한다. (OWNER 권한 필요)
 * 이미 활성 링크가 있으면 새로 만들지 않고 기존 링크를 그대로 반환한다(멱등).
 */
export const createInviteLink = async (
  projectId: number,
): Promise<CreateInviteLinkResponse> => {
  const response = await apiClient.post<ApiResponse<CreateInviteLinkResponse>>(
    `/api/projects/${projectId}/invites`,
  );

  return unwrapApiResponse(response.data);
};

export const getCreateInviteLinkErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, CREATE_INVITE_LINK_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
