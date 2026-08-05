import { Outlet } from "react-router-dom";
import LoginModal from "../../features/onboarding/components/LoginModal";
import useOnboardingAuth from "../../features/onboarding/hooks/useOnboardingAuth";
import { getAccessToken } from "../../shared/api/tokenStorage";
import { OnBoardingSideBar } from "../../shared/components/OnBoardingSideBar";

const MainLayout = () => {
  const isLoggedIn = Boolean(getAccessToken());
  const {
    isLoggedIn: authLoggedIn,
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleSocialLogin,
    handleLogout,
  } = useOnboardingAuth({ initialIsLoggedIn: isLoggedIn });

  const sidebarIsLoggedIn = authLoggedIn || isLoggedIn;

  return (
    <div className="flex min-h-screen w-full bg-gray-100 font-sans text-slate-800 select-none">
      <OnBoardingSideBar
        isLoggedIn={sidebarIsLoggedIn}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={() => {
          void handleLogout();
        }}
      />

      <div className="flex-1">
        <Outlet />
      </div>

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onKakaoLogin={() => handleSocialLogin("KAKAO")}
          onGoogleLogin={() => handleSocialLogin("GOOGLE")}
        />
      )}
    </div>
  );
};

export default MainLayout;
