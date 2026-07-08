import { useState, useEffect, useRef } from "react";
import {
  Home,
  LayoutGrid,
  FileText,
  ChevronDown,
  Link2,
  Settings,
  LogOut,
  ChevronRight,
  LogIn,
} from "lucide-react";

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
  // 원래 UI 스타일은 그대로 유지하고, 이벤트 제어용 상태와 Ref만 추가합니다.
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // 외부 영역 클릭 시 프로필 팝업을 닫는 로직
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
    <aside className="sticky top-0 z-40 flex h-screen w-64 min-w-[256px] flex-col justify-between border-r border-gray-200 bg-white font-sans select-none">
      <div>
        {/* 1. 상단 로고 영역 */}
        <div className="flex h-14 w-full items-center gap-2.5 border-b border-gray-200 px-5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
            W
          </div>
          <span className="text-m font-bold tracking-tight text-slate-800">
            WEVO
          </span>
        </div>

        {/* 2. 기존 내비게이션 메뉴 (원래 스타일 유지) */}
        <nav className="space-y-0.5 px-3 py-2">
          <div className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-xl bg-gray-100 px-3 transition-colors">
            <Home className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">홈</span>
          </div>

          <div className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-gray-400 transition-colors hover:bg-gray-100 hover:text-slate-700">
            <LayoutGrid className="h-4 w-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-500">프로젝트</span>
          </div>

          <div className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-gray-400 transition-colors hover:bg-gray-100 hover:text-slate-700">
            <FileText className="h-4 w-4 text-gray-300" />
            <span className="text-sm font-medium text-gray-500">완성본</span>
          </div>
        </nav>

        {/* 3. 최근 프로젝트 섹션 */}
        <div className="mt-5 px-5">
          <div className="mb-2 flex items-center justify-between text-[11px] font-bold tracking-wider text-gray-400">
            <span>최근 프로젝트</span>
            <ChevronDown className="h-3 w-3 cursor-pointer text-gray-400" />
          </div>
          <ul className="space-y-1 text-xs font-medium text-gray-600">
            <li className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 hover:text-slate-900">
              <span className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-purple-400" />
              <span className="truncate text-slate-700">PM Day 발표 준비</span>
            </li>
            <li className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 hover:text-slate-900">
              <span className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-blue-400" />
              <span className="truncate text-slate-700">
                캡스톤 서비스 제안서
              </span>
            </li>
            <li className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 hover:text-slate-900">
              <span className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-blue-400" />
              <span className="truncate text-slate-700">대외활동 기획안</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. 하단 프로필 및 클릭 이벤트 연동 영역 */}
      {isLoggedIn ? (
        <div
          ref={profileRef}
          className="relative border-t border-gray-100 p-3"
        >
          {/* 부드러운 업-슬라이딩 효과만 입힌 기존 프로필 팝업 UI */}
          {isProfileOpen && (
            <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-17 left-3 z-50 h-56 w-56 origin-bottom overflow-hidden rounded-2xl border border-slate-300/80 bg-white shadow-xl transition-all duration-200 ease-out">
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
                    setIsProfileOpen(false);
                    onLogoutClick?.();
                  }}
                  className="flex h-10 w-full items-center gap-2.5 rounded-2xl px-3 text-sm font-normal text-red-500 transition-colors hover:bg-red-50/50"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          )}

          {/* 기존 프로필 트리거 버튼에 클릭 이벤트 맵핑 */}
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl p-1.5 transition-colors ${isProfileOpen ? "bg-slate-50" : "hover:bg-slate-50"}`}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow-sm">
              현
            </div>
            <span className="text-xs font-semibold text-slate-700">지현구</span>
          </div>
        </div>
      ) : (
        /* 기존 로그인하기 버튼 영역 유지 */
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={onLoginClick}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl p-1.5 text-left text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <div className="shadow-3xs flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold tracking-tight">
              로그인하기
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};
