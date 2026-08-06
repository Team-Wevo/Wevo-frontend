export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

export const getAccessToken = () =>
  getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;

export const getRefreshToken = () =>
  getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;

export const saveAuthTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  const storage = getStorage();

  storage?.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage?.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearAuthTokens = () => {
  const storage = getStorage();

  storage?.removeItem(ACCESS_TOKEN_KEY);
  storage?.removeItem(REFRESH_TOKEN_KEY);
};
