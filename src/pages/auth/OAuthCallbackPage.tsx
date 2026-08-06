import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { loginWithOAuth } from "../../features/auth/api/auth";
import {
  clearSavedOAuthState,
  getSavedOAuthState,
  getOAuthProviderFromPath,
  type OAuthProvider,
} from "../../features/auth/constants/oauth";
import {
  clearAuthTokens,
  saveAuthTokens,
} from "../../features/auth/utils/tokenStorage";
import {
  getApiErrorMessage,
  getApiErrorResponse,
} from "../../shared/api/error";
import { Button } from "../../shared/components/Button";

const getErrorMessage = (error: unknown) => {
  const response = getApiErrorResponse(error);
  const message = getApiErrorMessage(
    error,
    "로그인 처리 중 오류가 발생했습니다.",
  );

  return response?.code ? `[${response.code}] ${message}` : message;
};

const getOAuthRequestKey = (provider: OAuthProvider, code: string) => {
  return `oauth:login:${provider}:${code}`;
};

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { provider: providerPath } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const hasRequestedRef = useRef(false);
  const provider = getOAuthProviderFromPath(providerPath);
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");
  const code = searchParams.get("code");
  const callbackState = searchParams.get("state");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const savedState = provider ? getSavedOAuthState(provider) : null;
  const isStateValid = Boolean(
    provider && callbackState && savedState && callbackState === savedState,
  );

  const callbackErrorMessage = !provider
    ? "지원하지 않는 로그인 제공자입니다."
    : oauthError
      ? (oauthErrorDescription ?? oauthError)
      : !callbackState
        ? "OAuth 제공자가 state 파라미터를 반환하지 않아 로그인할 수 없습니다. 다시 시도해주세요."
        : !savedState
          ? "브라우저 저장소에 OAuth state 정보가 없어 로그인할 수 없습니다. 로그인 버튼부터 다시 시도해주세요."
          : !isStateValid
            ? "OAuth state 검증에 실패했습니다. 다시 시도해주세요."
            : !code
              ? "인가 코드가 없어 로그인할 수 없습니다."
              : null;

  useEffect(() => {
    if (!provider || !code || callbackErrorMessage || !isStateValid) {
      return;
    }

    const requestKey = getOAuthRequestKey(provider, code);
    const requestState = sessionStorage.getItem(requestKey);

    if (requestState === "in-progress" || requestState === "done") {
      return;
    }

    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    sessionStorage.setItem(requestKey, "in-progress");
    clearSavedOAuthState(provider);

    const handleOAuthCallback = async (oauthProvider: OAuthProvider) => {
      try {
        const tokens = await loginWithOAuth({
          provider: oauthProvider,
          code,
        });

        if (!tokens.accessToken || !tokens.refreshToken) {
          throw new Error("로그인 응답이 올바르지 않습니다.");
        }

        saveAuthTokens(tokens);
        sessionStorage.setItem(requestKey, "done");
        navigate("/home", { replace: true });
      } catch (error) {
        sessionStorage.removeItem(requestKey);
        clearAuthTokens();
        setErrorMessage(getErrorMessage(error));
      }
    };

    void handleOAuthCallback(provider);
  }, [callbackErrorMessage, code, isStateValid, navigate, provider]);

  const visibleErrorMessage = callbackErrorMessage ?? errorMessage;

  // 정상 처리 중에는 아무것도 그리지 않고 곧바로 홈으로 넘어간다.
  // 로그인에 실패한 경우에만 원인을 알려준다.
  if (!visibleErrorMessage) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg leading-7 font-semibold text-gray-900">
          로그인하지 못했어요
        </h1>
        <p className="text-error mt-4 text-sm leading-6">
          {visibleErrorMessage}
        </p>
        <Button
          type="main"
          onClick={() => navigate("/", { replace: true })}
          className="mt-6 h-11 w-full"
        >
          <span>홈으로 이동</span>
        </Button>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
