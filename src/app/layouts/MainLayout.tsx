import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import LoginModal from "../../features/onboarding/components/LoginModal";
import useOnboardingAuth from "../../features/onboarding/hooks/useOnboardingAuth";
import { getAccessToken } from "../../shared/api/tokenStorage";
import { OnBoardingSideBar } from "../../shared/components/OnBoardingSideBar";
import MobileDrawer from "../../shared/components/MobileDrawer";
import { MainLayoutContext } from "./mainLayoutContext";

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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  // 라우트가 바뀌면 모바일 드로어를 닫는다.
  // effect 대신 렌더 중 이전 경로와 비교해 조정한다(React 권장 — 불필요한 재렌더 방지).
  const [drawerPath, setDrawerPath] = useState(location.pathname);
  if (location.pathname !== drawerPath) {
    setDrawerPath(location.pathname);
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  }

  const contextValue = useMemo(
    () => ({
      isLoggedIn: sidebarIsLoggedIn,
      openLoginModal: () => setIsLoginModalOpen(true),
    }),
    [sidebarIsLoggedIn, setIsLoginModalOpen],
  );

  const sidebar = (
    <OnBoardingSideBar
      isLoggedIn={sidebarIsLoggedIn}
      onLoginClick={() => setIsLoginModalOpen(true)}
      onLogoutClick={() => {
        void handleLogout();
      }}
    />
  );

  return (
    <MainLayoutContext.Provider value={contextValue}>
      <div className="flex min-h-screen w-full bg-gray-100 font-sans text-slate-800 select-none">
        <div className="hidden md:block">{sidebar}</div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2 md:hidden">
            <button
              type="button"
              aria-label="메뉴 열기"
              onClick={() => setIsNavOpen(true)}
              className="flex cursor-pointer items-center rounded-sm text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <img
              src="/Wevo-logo.svg"
              alt="Wevo"
              className="size-7 object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>

        <MobileDrawer
          open={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          side="left"
          label="메뉴"
        >
          {sidebar}
        </MobileDrawer>

        {isLoginModalOpen && (
          <LoginModal
            onClose={() => setIsLoginModalOpen(false)}
            onKakaoLogin={() => handleSocialLogin("KAKAO")}
            onGoogleLogin={() => handleSocialLogin("GOOGLE")}
          />
        )}
      </div>
    </MainLayoutContext.Provider>
  );
};

export default MainLayout;
