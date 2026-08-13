const POST_LOGIN_REDIRECT_KEY = "auth:post-login-redirect";
const TRUSTED_REDIRECT_BASE_URL = "https://wevo.internal";

const isSafeInternalPath = (path: string) => {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  try {
    const trustedBase = new URL(TRUSTED_REDIRECT_BASE_URL);
    const destination = new URL(path, trustedBase);

    return destination.origin === trustedBase.origin;
  } catch {
    return false;
  }
};

export const savePostLoginRedirect = (path: string) => {
  if (!isSafeInternalPath(path)) {
    return;
  }

  try {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 기본 홈 경로로 이동한다.
  }
};

export const consumePostLoginRedirect = () => {
  try {
    const path = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

    return path && isSafeInternalPath(path) ? path : null;
  } catch {
    return null;
  }
};
