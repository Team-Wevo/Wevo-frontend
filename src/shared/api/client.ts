import axios, { isAxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
  type AuthTokens,
} from "./tokenStorage";
import type { ApiResponse } from "./types";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const resolvedBaseUrl =
  configuredBaseUrl || (import.meta.env.DEV ? "" : "https://api.wevo.kr");

export const apiClient = axios.create({
  baseURL: resolvedBaseUrl,
});

const tokenClient = axios.create({
  baseURL: resolvedBaseUrl,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let tokenRefreshRequest: Promise<AuthTokens> | null = null;

const requestNewTokens = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh Token이 없습니다.");
  }

  const response = await tokenClient.post<ApiResponse<AuthTokens>>(
    "/api/auth/reissue",
    { refreshToken },
  );

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  saveAuthTokens(response.data.data);
  return response.data.data;
};

const refreshTokens = () => {
  tokenRefreshRequest ??= requestNewTokens().finally(() => {
    tokenRefreshRequest = null;
  });

  return tokenRefreshRequest;
};

const isAuthRequest = (url: string | undefined) =>
  ["/api/auth/login", "/api/auth/logout", "/api/auth/reissue"].some((path) =>
    url?.endsWith(path),
  );

const redirectToLogin = () => {
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
};

const clearSession = (shouldRedirect: boolean) => {
  clearAuthTokens();

  if (shouldRedirect) {
    redirectToLogin();
  }
};

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isLogoutRequest = originalRequest?.url?.endsWith("/api/auth/logout");

    if (
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest(originalRequest.url) ||
      !getRefreshToken()
    ) {
      clearSession(!isAuthRequest(originalRequest?.url) && !isLogoutRequest);
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { accessToken } = await refreshTokens();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch {
      clearSession(true);
      return Promise.reject(error);
    }
  },
);
