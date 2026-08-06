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

// 내 정보 조회 — 프로필 표시·세션 복원용
export const getMyProfile = async (): Promise<MyProfileResponse> => {
  const response =
    await apiClient.get<ApiResponse<MyProfileResponse>>("/api/users/me");

  return unwrapApiResponse(response.data);
};
