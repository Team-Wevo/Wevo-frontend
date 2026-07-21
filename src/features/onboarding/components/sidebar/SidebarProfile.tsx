import { useEffect, useRef, useState } from "react";
import ProfilePopup from "./ProfilePopup";

interface SidebarProfileProps {
  onLogoutClick?: () => void;
}

const SidebarProfile = ({ onLogoutClick }: SidebarProfileProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
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
        className={`flex cursor-pointer items-center gap-3 rounded-xl p-1.5 transition-colors ${isProfileOpen ? "bg-slate-50" : "hover:bg-slate-50"}`}
      >
        <div className="flex items-center justify-center rounded-full text-xs font-bold text-white shadow-sm">
          <img
            src="../../../../../public/Wevo-logo.svg"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
        </div>
        <span className="text-xs font-semibold text-slate-700">지현구</span>
      </div>
    </div>
  );
};

export default SidebarProfile;
