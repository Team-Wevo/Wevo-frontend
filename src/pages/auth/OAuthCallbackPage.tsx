import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { loginWithOAuth } from "../../features/auth/api/auth";
import { getMyProfile } from "../../features/auth/api/user";
import { MY_PROFILE_QUERY_KEY } from "../../features/auth/hooks/useMyProfile";
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
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";
import { queryClient } from "../../shared/api/queryClient";

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
  // 요청 시작 시 clearSavedOAuthState로 저장소가 비워지므로, 첫 렌더의 값을 고정해 둔다.
  // 그러지 않으면 재렌더링에서 savedState가 null이 되어 검증 결과가 저장소 오류로 뒤바뀐다.
  const [savedState] = useState(() =>
    provider ? getSavedOAuthState(provider) : null,
  );
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

        try {
          const profile = await getMyProfile();
          queryClient.setQueryData(MY_PROFILE_QUERY_KEY, profile);
        } catch {
          // 프로필 사전 조회가 실패해도 로그인은 유지하고 홈에서 다시 조회한다.
          queryClient.removeQueries({ queryKey: MY_PROFILE_QUERY_KEY });
        }

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

  // 요청이 실제로 실패한 뒤에는 사전 검증 문구보다 서버가 알려준 원인을 우선 보여준다.
  const visibleErrorMessage = errorMessage ?? callbackErrorMessage;

  // 처리 중에는 스피너만 보여주고, 완료되면 곧바로 홈으로 넘어간다.
  if (!visibleErrorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <LoadingSpinner size={80} />
      </div>
    );
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
