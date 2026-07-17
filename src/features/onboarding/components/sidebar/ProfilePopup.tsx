import { ChevronRight, Link2, LogOut, Settings } from "lucide-react";

interface ProfilePopupProps {
  onClose?: () => void;
  onLogoutClick?: () => void;
}

const ProfilePopup = ({ onClose, onLogoutClick }: ProfilePopupProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-17 z-50 h-56 w-58 origin-bottom overflow-hidden rounded-2xl border border-slate-300/80 bg-white shadow-xl transition-all duration-200 ease-out">
      <div className="flex h-32 w-full flex-col justify-between border-b border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
            현
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <span className="truncate text-sm leading-tight font-semibold text-gray-950">
              지현구
            </span>
            <span className="mt-1 truncate text-[11px] leading-none font-normal text-slate-400">
              alexjoe85@gmail.com
            </span>
          </div>
        </div>

        <div className="flex h-12 w-full flex-col justify-between rounded-2xl bg-gray-100 p-2.5">
          <div className="flex items-center justify-between text-xs font-normal">
            <div className="flex items-center gap-1 text-gray-500">
              <Link2 className="h-3.5 w-3.5 rotate-45 text-indigo-500" />
              <span className="text-gray-500">크레딧</span>
            </div>
            <div className="font-medium text-gray-900">
              18 <span className="text-gray-400">/</span> 25
            </div>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full w-[72%] rounded-full bg-indigo-500" />
          </div>
        </div>
      </div>

      <div className="flex h-24 w-full flex-col justify-center bg-white p-1.5">
        <button className="flex h-10 w-full items-center justify-between rounded-2xl px-3 text-sm font-normal text-gray-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
          <div className="flex items-center gap-2.5">
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>계정 설정</span>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-400" />
        </button>

        <button
          onClick={() => {
            onClose?.();
            onLogoutClick?.();
          }}
          className="flex h-10 w-full items-center gap-2.5 rounded-2xl px-3 text-sm font-normal text-red-500 transition-colors hover:bg-red-50/50"
        >
          <LogOut className="h-3.5 w-3.5 text-red-400" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
