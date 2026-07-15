import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    return token === "mock-token" || initialIsLoggedIn;
  });

  const handleSocialLogin = () => {
    localStorage.setItem("accessToken", "mock-token");
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
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
