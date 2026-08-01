import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/api/auth";
import {
  createOAuthState,
  buildOAuthAuthorizeUrl,
  saveOAuthState,
  type OAuthProvider,
} from "../../auth/constants/oauth";
import { clearAuthTokens } from "../../auth/utils/tokenStorage";

interface UseOnboardingAuthOptions {
  initialIsLoggedIn?: boolean;
}

const useOnboardingAuth = ({
  initialIsLoggedIn = false,
}: UseOnboardingAuthOptions = {}) => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return Boolean(token) || initialIsLoggedIn;
  });

  const handleSocialLogin = (provider: OAuthProvider) => {
    setIsLoginModalOpen(false);

    try {
      const state = createOAuthState();
      saveOAuthState(provider, state);
      const authorizeUrl = buildOAuthAuthorizeUrl(provider, { state });

      if (!authorizeUrl.includes("state=")) {
        throw new Error(
          "OAuth Authorization URL에 state 파라미터가 누락되었습니다.",
        );
      }

      if (import.meta.env.DEV) {
        // 디버깅 편의를 위한 개발 환경 로그
        console.info("[OAuth] redirect", {
          provider,
          state,
          authorizeUrl,
        });
      }

      window.location.assign(authorizeUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "OAuth 로그인 정보를 확인해주세요.";
      window.alert(message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 로그아웃 API 실패 시에도 로컬 토큰은 정리해 UX를 일관되게 유지한다.
    }

    clearAuthTokens();
    setIsLoggedIn(false);
    navigate("/");
  };

  return {
    isLoggedIn,
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleSocialLogin,
    handleLogout,
  };
};

export default useOnboardingAuth;
