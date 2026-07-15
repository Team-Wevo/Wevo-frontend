import LoginButton from "./LoginButton";
import Logo from "./Logo";
import NavigationMenu from "./NavigationMenu";
import RecentProjectList from "./RecentProjectList";
import SidebarProfile from "./SidebarProfile";

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
