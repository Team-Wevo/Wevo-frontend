import { apiClient } from "../../../shared/api/client";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import { getOAuthRedirectUri, type OAuthProvider } from "../constants/oauth";
import type { AuthTokens } from "../utils/tokenStorage";

interface LoginWithOAuthPayload {
  provider: OAuthProvider;
  code: string;
}

export const loginWithOAuth = async ({
  provider,
  code,
}: LoginWithOAuthPayload): Promise<AuthTokens> => {
  const response = await apiClient.post<ApiResponse<AuthTokens>>(
    "/api/auth/login",
    {
      provider,
      code,
      redirectUri: getOAuthRedirectUri(provider),
    },
  );

  return unwrapApiResponse(response.data);
};

export const logout = async (): Promise<void> => {
  const response = await apiClient.post<ApiResponse<void>>("/api/auth/logout");

  unwrapApiResponse(response.data);
};

export const reissueAuthToken = async (
  refreshToken: string,
): Promise<AuthTokens> => {
  const response = await apiClient.post<ApiResponse<AuthTokens>>(
    "/api/auth/reissue",
    {
      refreshToken,
    },
  );

  return unwrapApiResponse(response.data);
};
