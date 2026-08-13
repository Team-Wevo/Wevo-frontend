const POST_LOGIN_REDIRECT_KEY = "auth:post-login-redirect";

const isSafeInternalPath = (path: string) =>
  path.startsWith("/") && !path.startsWith("//");

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
