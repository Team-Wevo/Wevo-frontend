import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/api/auth";
import {
  buildOAuthAuthorizeUrl,
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
      window.location.assign(buildOAuthAuthorizeUrl(provider));
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
