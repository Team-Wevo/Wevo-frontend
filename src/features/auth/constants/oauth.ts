export type OAuthProvider = "GOOGLE" | "KAKAO";

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

export const buildOAuthAuthorizeUrl = (provider: OAuthProvider) => {
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

  return `${authorizeEndpoint}?${params.toString()}`;
};
