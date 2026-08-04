import { Outlet } from "react-router-dom";
import { OnBoardingSideBar } from "../../shared/components/OnBoardingSideBar";
import useOnboardingAuth from "../../features/onboarding/hooks/useOnboardingAuth";
import LoginModal from "../../features/onboarding/components/LoginModal";

const MainLayout = () => {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
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
