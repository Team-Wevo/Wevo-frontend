export type OAuthProvider = "GOOGLE" | "KAKAO";

const OAUTH_STATE_KEY_PREFIX = "oauth:state";
const OAUTH_REAUTH_REQUIRED_KEY_PREFIX = "oauth:reauth-required";

interface OAuthProviderConfig {
  provider: OAuthProvider;
  callbackPath: string;
  authorizeEndpoint: string;
}

const OAUTH_PROVIDER_CONFIGS: OAuthProviderConfig[] = [
  {
    provider: "GOOGLE",
    callbackPath: "google",
    authorizeEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  },
  {
    provider: "KAKAO",
    callbackPath: "kakao",
    authorizeEndpoint: "https://kauth.kakao.com/oauth/authorize",
  },
];

const normalizeBaseUrl = (baseUrl: string | undefined) => {
  if (!baseUrl) {
    return "";
  }

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

const readEnvValue = (value: string | undefined) => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const resolveFrontendOrigin = () => {
  const envOrigin = normalizeBaseUrl(import.meta.env.VITE_FRONTEND_ORIGIN);

  if (envOrigin) {
    return envOrigin;
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://wevo.kr";
};

const getOAuthProviderConfig = (provider: OAuthProvider) => {
  const config = OAUTH_PROVIDER_CONFIGS.find(
    (item) => item.provider === provider,
  );

  if (!config) {
    throw new Error("지원하지 않는 OAuth 제공자입니다.");
  }

  return config;
};

export const getOAuthProviderFromPath = (
  providerPath: string | undefined,
): OAuthProvider | null => {
  if (!providerPath) {
    return null;
  }

  const normalized = providerPath.toLowerCase();
  const found = OAUTH_PROVIDER_CONFIGS.find(
    (providerConfig) => providerConfig.callbackPath === normalized,
  );

  return found?.provider ?? null;
};

export const getOAuthRedirectUri = (provider: OAuthProvider) => {
  const config = getOAuthProviderConfig(provider);

  if (provider === "GOOGLE") {
    return (
      readEnvValue(import.meta.env.VITE_GOOGLE_REDIRECT_URI) ??
      `${resolveFrontendOrigin()}/oauth/callback/${config.callbackPath}`
    );
  }

  return (
    readEnvValue(import.meta.env.VITE_KAKAO_REDIRECT_URI) ??
    `${resolveFrontendOrigin()}/oauth/callback/${config.callbackPath}`
  );
};

const getOAuthClientId = (provider: OAuthProvider) => {
  if (provider === "GOOGLE") {
    return readEnvValue(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  }

  return readEnvValue(import.meta.env.VITE_KAKAO_CLIENT_ID);
};

const getOAuthScope = (provider: OAuthProvider) => {
  if (provider === "GOOGLE") {
    return (
      readEnvValue(import.meta.env.VITE_GOOGLE_SCOPE) ?? "openid email profile"
    );
  }

  return (
    readEnvValue(import.meta.env.VITE_KAKAO_SCOPE) ??
    "profile_nickname profile_image"
  );
};

const getOAuthStateStorageKey = (provider: OAuthProvider) => {
  return `${OAUTH_STATE_KEY_PREFIX}:${provider}`;
};

const getOAuthReauthStorageKey = (provider: OAuthProvider) => {
  return `${OAUTH_REAUTH_REQUIRED_KEY_PREFIX}:${provider}`;
};

const trySetStorageItem = (storage: Storage, key: string, value: string) => {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const tryGetStorageItem = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const tryRemoveStorageItem = (storage: Storage, key: string) => {
  try {
    storage.removeItem(key);
  } catch {
    // 저장소 접근 실패는 비정상 환경에서만 발생하며 로그인 흐름을 즉시 중단하지 않는다.
  }
};

export const createOAuthState = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const saveOAuthState = (provider: OAuthProvider, state: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getOAuthStateStorageKey(provider);
  const savedInSession = trySetStorageItem(sessionStorage, storageKey, state);

  if (!savedInSession) {
    trySetStorageItem(localStorage, storageKey, state);
    return;
  }

  // 브라우저별 저장소 정책 차이를 고려해 localStorage에도 백업한다.
  trySetStorageItem(localStorage, storageKey, state);
};

export const getSavedOAuthState = (provider: OAuthProvider) => {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = getOAuthStateStorageKey(provider);

  return (
    tryGetStorageItem(sessionStorage, storageKey) ??
    tryGetStorageItem(localStorage, storageKey)
  );
};

export const clearSavedOAuthState = (provider: OAuthProvider) => {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getOAuthStateStorageKey(provider);

  tryRemoveStorageItem(sessionStorage, storageKey);
  tryRemoveStorageItem(localStorage, storageKey);
};

export const markOAuthReauthRequired = (provider: OAuthProvider) => {
  if (typeof window === "undefined") {
    return;
  }

  trySetStorageItem(localStorage, getOAuthReauthStorageKey(provider), "true");
};

export const isOAuthReauthRequired = (provider: OAuthProvider) => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    tryGetStorageItem(localStorage, getOAuthReauthStorageKey(provider)) ===
    "true"
  );
};

export const clearOAuthReauthRequired = (provider: OAuthProvider) => {
  if (typeof window === "undefined") {
    return;
  }

  tryRemoveStorageItem(localStorage, getOAuthReauthStorageKey(provider));
};

interface BuildOAuthAuthorizeUrlOptions {
  state?: string;
  forceLogin?: boolean;
}

export const buildOAuthAuthorizeUrl = (
  provider: OAuthProvider,
  options: BuildOAuthAuthorizeUrlOptions = {},
) => {
  const { authorizeEndpoint } = getOAuthProviderConfig(provider);
  const clientId = getOAuthClientId(provider);

  if (!clientId) {
    const envKey =
      provider === "GOOGLE" ? "VITE_GOOGLE_CLIENT_ID" : "VITE_KAKAO_CLIENT_ID";

    throw new Error(
      `${provider} OAuth 클라이언트 ID가 설정되지 않았습니다. ${envKey} 값을 확인해주세요.`,
    );
  }

  const redirectUri = getOAuthRedirectUri(provider);
  const scope = getOAuthScope(provider);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
  });

  if (options.state) {
    params.set("state", options.state);
  }

  if (provider === "KAKAO" && options.forceLogin) {
    params.set("prompt", "login");
  }

  return `${authorizeEndpoint}?${params.toString()}`;
};
