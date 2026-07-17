import { Outlet, useNavigate } from "react-router-dom";
import { OnBoardingSideBar } from "../../shared/layouts/OnBoardingSideBar";
import useOnboardingAuth from "../../features/onboarding/hooks/useOnboardingAuth";
import LoginModal from "../../features/onboarding/components/LoginModal";

const MainLayout = () => {
  const navigate = useNavigate();
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
    <div className="flex min-h-screen w-full bg-[#F5F6FA] font-sans text-slate-800 select-none">
      <OnBoardingSideBar
        isLoggedIn={sidebarIsLoggedIn}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={() => {
          handleLogout();
          navigate("/");
        }}
      />

      <div className="flex-1">
        <Outlet />
      </div>

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onSocialLogin={handleSocialLogin}
        />
      )}
    </div>
  );
};

export default MainLayout;
