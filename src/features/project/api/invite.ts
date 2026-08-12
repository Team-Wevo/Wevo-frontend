import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import type { ProjectMemberRole } from "./projectList";

export interface InvitePreviewResponse {
  projectId: number;
  projectTitle: string;
  memberCount: number;
  maxMembers: number;
  full: boolean;
}

export interface JoinProjectResponse {
  projectId: number;
  projectTitle: string;
  role: ProjectMemberRole;
}

const GET_INVITE_PREVIEW_FALLBACK_MESSAGE = "초대 링크를 확인하지 못했습니다.";
const JOIN_PROJECT_FALLBACK_MESSAGE = "프로젝트 참여에 실패했습니다.";

// 참여 전 미리보기 — 프로젝트명·현재 인원. 로그인 필요.
export const getInvitePreview = async (
  token: string,
): Promise<InvitePreviewResponse> => {
  const response = await apiClient.get<ApiResponse<InvitePreviewResponse>>(
    `/api/invites/${token}`,
  );

  return unwrapApiResponse(response.data);
};

export const getInvitePreviewErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GET_INVITE_PREVIEW_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};

// 초대 링크로 참여 — MEMBER로 참여. 이미 멤버면 기존 역할로 멱등 성공.
export const joinProjectByInvite = async (
  token: string,
): Promise<JoinProjectResponse> => {
  const response = await apiClient.post<ApiResponse<JoinProjectResponse>>(
    `/api/invites/${token}/join`,
  );

  return unwrapApiResponse(response.data);
};

export const getJoinProjectErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, JOIN_PROJECT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
