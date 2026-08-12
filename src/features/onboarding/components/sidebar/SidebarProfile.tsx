import { useEffect, useRef, useState } from "react";
import { useMyProfile } from "../../../auth/hooks/useMyProfile";
import ProfilePopup from "./ProfilePopup";

interface SidebarProfileProps {
  onLogoutClick?: () => void;
}

const SidebarProfile = ({ onLogoutClick }: SidebarProfileProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  // 로그인 상태에서만 렌더링되는 컴포넌트라 항상 조회한다.
  const { data: profile } = useMyProfile(true);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 포털로 body에 렌더링되는 모달 내부 클릭은 외부 클릭으로 처리하지 않음
      if (target.closest('[data-profile-popup="true"]')) {
        return;
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isProfileOpen]);

  return (
    <div
      ref={profileRef}
      className="relative"
    >
      {isProfileOpen && (
        <ProfilePopup
          onClose={() => setIsProfileOpen(false)}
          onLogoutClick={onLogoutClick}
        />
      )}

      <div
        onClick={() => setIsProfileOpen((prev) => !prev)}
        className={`flex cursor-pointer items-center gap-3 rounded-xl p-1.5 transition-colors ${isProfileOpen ? "bg-gray-100" : "hover:bg-gray-100"}`}
      >
        <div className="flex items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
          <img
            src="/Wevo-logo.svg"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
        </div>
        <span className="text-sm font-semibold text-slate-700">
          {profile?.name ?? ""}
        </span>
      </div>
    </div>
  );
};

export default SidebarProfile;
