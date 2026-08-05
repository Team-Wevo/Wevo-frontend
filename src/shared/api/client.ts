import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const resolvedBaseUrl =
  configuredBaseUrl || (import.meta.env.DEV ? "" : "https://api.wevo.kr");

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const LOGIN_PATH = "/api/auth/login";
const REISSUE_PATH = "/api/auth/reissue";

interface RetryableRequestConfig {
  _retry?: boolean;
}

interface ReissueResponse {
  success: boolean;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

let isReissuing = false;
let pendingRequests: Array<(newToken: string | null) => void> = [];

const clearPendingRequests = (newToken: string | null) => {
  pendingRequests.forEach((callback) => callback(newToken));
  pendingRequests = [];
};

const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const redirectToLogin = () => {
  window.location.replace("/");
};

const isAuthRefreshExcludedRequest = (url?: string) => {
  if (!url) {
    return false;
  }

  return url.includes(LOGIN_PATH) || url.includes(REISSUE_PATH);
};

const requestTokenReissue = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    return null;
  }

  const response = await axios.post<ReissueResponse>(
    REISSUE_PATH,
    { refreshToken },
    {
      baseURL: resolvedBaseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const nextAccessToken = response.data.data?.accessToken;
  const nextRefreshToken = response.data.data?.refreshToken;

  if (!nextAccessToken || !nextRefreshToken) {
    return null;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken);

  return nextAccessToken;
};

export const apiClient = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig & {
      headers?: Record<string, string>;
      url?: string;
    };

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (isAuthRefreshExcludedRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAuthTokens();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isReissuing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          resolve(apiClient(originalRequest));
        });
      });
    }

    isReissuing = true;

    try {
      const newToken = await requestTokenReissue();

      if (!newToken) {
        clearPendingRequests(null);
        clearAuthTokens();
        redirectToLogin();
        return Promise.reject(error);
      }

      clearPendingRequests(newToken);
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      };

      return apiClient(originalRequest);
    } catch {
      clearPendingRequests(null);
      clearAuthTokens();
      redirectToLogin();
      return Promise.reject(error);
    } finally {
      isReissuing = false;
    }
  },
);
