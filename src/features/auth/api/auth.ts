import { apiClient } from "../../../shared/api/client";
import type { ApiResponse } from "../../../shared/api/types";
import { getOAuthRedirectUri, type OAuthProvider } from "../constants/oauth";
import type { AuthTokens } from "../utils/tokenStorage";

interface LoginWithOAuthPayload {
  provider: OAuthProvider;
  code: string;
  redirectUri?: string;
}

export const loginWithOAuth = async ({
  provider,
  code,
  redirectUri,
}: LoginWithOAuthPayload): Promise<ApiResponse<AuthTokens>> => {
  const response = await apiClient.post<ApiResponse<AuthTokens>>(
    "/api/auth/login",
    {
      provider,
      code,
      redirectUri: redirectUri ?? getOAuthRedirectUri(provider),
    },
  );

  return response.data;
};

export const logout = async (): Promise<ApiResponse<string>> => {
  const response =
    await apiClient.post<ApiResponse<string>>("/api/auth/logout");

  return response.data;
};
