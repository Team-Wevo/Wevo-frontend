import { apiClient } from "../../../shared/api/client";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export type UserStatus = "ACTIVE" | "INACTIVE" | "WITHDRAWN";

export interface MyProfileResponse {
  userId: number;
  name: string;
  email: string;
  profileImageUrl: string;
  status: UserStatus;
}

export interface ProfileUpdateRequest {
  name: string;
}

// 내 정보 조회 — 프로필 표시·세션 복원용
export const getMyProfile = async (): Promise<MyProfileResponse> => {
  const response =
    await apiClient.get<ApiResponse<MyProfileResponse>>("/api/users/me");

  return unwrapApiResponse(response.data);
};

// 내 프로필 수정 — 표시 이름만 변경
export const updateMyProfile = async (
  payload: ProfileUpdateRequest,
): Promise<MyProfileResponse> => {
  const response = await apiClient.patch<ApiResponse<MyProfileResponse>>(
    "/api/users/me",
    payload,
  );

  return unwrapApiResponse(response.data);
};

// 회원 탈퇴 — 소프트 삭제(작성물 보존)
export const withdrawMyAccount = async (): Promise<void> => {
  await apiClient.delete("/api/users/me");
};
