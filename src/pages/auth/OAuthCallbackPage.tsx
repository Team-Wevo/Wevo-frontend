import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
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

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      { code?: string; message?: string } | undefined;

    if (responseData?.message) {
      return responseData.code
        ? `[${responseData.code}] ${responseData.message}`
        : responseData.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "로그인 처리 중 오류가 발생했습니다.";
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
      : !callbackState || !savedState
        ? "OAuth state 정보가 없어 로그인할 수 없습니다. 다시 시도해주세요."
        : !isStateValid
          ? "OAuth state 검증에 실패했습니다. 다시 시도해주세요."
          : !code
            ? "인가 코드가 없어 로그인할 수 없습니다."
            : null;

  useEffect(() => {
    if (!provider || !callbackState || !savedState) {
      return;
    }

    clearSavedOAuthState(provider);
  }, [callbackState, provider, savedState]);

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

    const handleOAuthCallback = async (oauthProvider: OAuthProvider) => {
      try {
        const response = await loginWithOAuth({
          provider: oauthProvider,
          code,
        });

        if (
          !response.success ||
          !response.data?.accessToken ||
          !response.data?.refreshToken
        ) {
          throw new Error(
            response.message || "로그인 응답이 올바르지 않습니다.",
          );
        }

        saveAuthTokens(response.data);
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="font-['Noto_Sans_KR'] text-xl font-bold text-slate-900">
          OAuth 로그인
        </h1>

        {visibleErrorMessage ? (
          <div className="mt-4 space-y-4">
            <p className="font-['Noto_Sans_KR'] text-sm leading-6 text-red-600">
              {visibleErrorMessage}
            </p>
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="h-11 w-full rounded-xl bg-slate-900 font-['Noto_Sans_KR'] text-sm font-semibold text-white hover:bg-slate-800"
            >
              홈으로 이동
            </button>
          </div>
        ) : (
          <p className="mt-4 font-['Noto_Sans_KR'] text-sm leading-6 text-slate-600">
            로그인 처리 중입니다. 잠시만 기다려주세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
