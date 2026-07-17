import LoginButton from "../../features/onboarding/components/sidebar/LoginButton";
import Logo from "../../features/onboarding/components/sidebar/Logo";
import NavigationMenu from "../../features/onboarding/components/sidebar/NavigationMenu";
import RecentProjectList from "../../features/onboarding/components/sidebar/RecentProjectList";
import SidebarProfile from "../../features/onboarding/components/sidebar/SidebarProfile";

interface OnBoardingSideBarProps {
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export const OnBoardingSideBar = ({
  isLoggedIn = false,
  onLoginClick,
  onLogoutClick,
}: OnBoardingSideBarProps) => {
  return (
    <aside className="sticky top-0 z-40 flex h-screen w-64 min-w-[256px] flex-col justify-between border-r border-gray-200 bg-white font-sans select-none">
      <div>
        <Logo />
        <NavigationMenu />
        <RecentProjectList />
      </div>

      {isLoggedIn ? (
        <div className="relative border-t border-gray-100 p-3">
          <SidebarProfile onLogoutClick={onLogoutClick} />
        </div>
      ) : (
        <div className="border-t border-gray-100 p-3">
          <LoginButton onClick={onLoginClick} />
        </div>
      )}
    </aside>
  );
};

export default OnBoardingSideBar;
