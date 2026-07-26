import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Link2, LogOut, Settings } from "lucide-react";

interface ProfilePopupProps {
  onClose?: () => void;
  onLogoutClick?: () => void;
}

type TabKey = "profile" | "general";

const ProfilePopup = ({ onClose, onLogoutClick }: ProfilePopupProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    email: "alexjoe85@gmail.com",
    loginMethod: "카카오",
    name: "지현구",
  });

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  // 💡 사용하지 않는 stopModalPropagation 함수는 제거했습니다!

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    setIsSettingsOpen(false);
    onLogoutClick?.();
  };

  const logoutConfirmModal = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20">
      <div
        className="w-96 rounded-2xl bg-white p-6 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex flex-col gap-2">
          <h2 className="text-lg leading-7 font-semibold text-gray-900">
            로그아웃 할까요?
          </h2>
          <p className="text-xs leading-5 font-normal text-slate-600">
            현재 계정에서 로그아웃됩니다.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowLogoutModal(false)}
            className="rounded-lg px-4 py-2 text-xs leading-4 font-medium text-slate-600 transition hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleLogoutConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-xs leading-4 font-medium text-white transition hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );

  const withdrawConfirmModal = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20">
      <div
        className="w-96 rounded-xl bg-white p-6 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex flex-col gap-2">
          <h2 className="text-lg leading-7 font-semibold text-gray-900">
            정말 탈퇴할까요?
          </h2>
          <p className="text-xs leading-5 font-normal text-slate-600">
            탈퇴 시 내가 만든 프로젝트와 작성 데이터가 모두 삭제되며, 되돌릴 수
            없습니다.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowWithdrawModal(false)}
            className="rounded-lg px-4 py-2 text-xs leading-4 font-medium text-slate-600 transition hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              setShowWithdrawModal(false);
            }}
            className="rounded-lg bg-red-500 px-4 py-2 text-xs leading-4 font-medium text-white transition hover:bg-red-600"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );

  const handleProfileChange = (
    field: "email" | "loginMethod" | "name",
    value: string,
  ) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const modalContent = (
    <div
      data-profile-popup="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
    >
      <div
        className="relative inline-flex h-[500px] w-[800px] items-start justify-start overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="inline-flex w-60 flex-col items-start justify-start gap-4 self-stretch overflow-hidden bg-white px-4 py-6">
          <div className="text-Black justify-start font-['Pretendard'] text-lg leading-7 font-semibold">
            설정
          </div>
          <div className="flex flex-col items-start justify-start gap-1 self-stretch overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`inline-flex items-center justify-start self-stretch overflow-hidden rounded-lg px-3 py-2 transition ${
                activeTab === "profile"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "bg-white font-normal text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="justify-start font-['Pretendard'] text-base leading-6">
                프로필
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`inline-flex items-center justify-start self-stretch overflow-hidden rounded-lg px-3 py-2 transition ${
                activeTab === "general"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "bg-white font-normal text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="justify-start font-['Pretendard'] text-base leading-6">
                일반
              </div>
            </button>
          </div>
        </div>

        <div className="bg-Gray-5 w-px self-stretch" />

        <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 self-stretch overflow-hidden p-6">
          {activeTab === "profile" && (
            <div className="inline-flex items-center justify-between self-stretch overflow-hidden">
              <div className="text-Gray-10 justify-start font-['Pretendard'] text-lg leading-7 font-semibold">
                프로필
              </div>
              <button
                type="button"
                onClick={handleCloseSettings}
                className="text-Gray-8 justify-start font-['Pretendard'] text-sm leading-5 font-normal transition hover:text-black"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === "general" && (
            <div className="inline-flex items-center justify-between self-stretch overflow-hidden">
              <div className="text-Gray-10 justify-start font-['Pretendard'] text-lg leading-7 font-semibold">
                일반
              </div>
              <button
                type="button"
                onClick={handleCloseSettings}
                className="text-Gray-8 justify-start font-['Pretendard'] text-sm leading-5 font-normal transition hover:text-black"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex-1 self-stretch overflow-y-auto">
            {activeTab === "profile" ? (
              <div className="inline-flex w-full items-start justify-start gap-6 overflow-hidden">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[999px] bg-indigo-600 font-['Pretendard'] text-3xl font-bold text-white">
                  지
                </div>
                <div className="inline-flex flex-1 flex-col items-start justify-start gap-5 overflow-hidden">
                  <div className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
                    <div className="text-Gray-8 justify-start font-['Pretendard'] text-xs leading-4 font-medium">
                      이메일
                    </div>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      className="text-Gray-7 inline-flex items-center justify-start self-stretch rounded-lg bg-gray-100 px-4 py-3 font-['Pretendard'] text-sm leading-5 font-normal transition outline-none focus:bg-white"
                    />
                    <div className="text-Gray-8 justify-start font-['Pretendard'] text-xs leading-4 font-normal">
                      소셜 로그인 이메일은 변경할 수 없습니다.
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
                    <div className="text-Gray-8 justify-start font-['Pretendard'] text-xs leading-4 font-medium">
                      로그인 방식
                    </div>
                    <input
                      type="text"
                      value={profileForm.loginMethod}
                      onChange={(e) =>
                        handleProfileChange("loginMethod", e.target.value)
                      }
                      className="text-Gray-10 inline-flex items-center justify-start self-stretch rounded-lg bg-gray-100 px-4 py-3 font-['Pretendard'] text-sm leading-5 font-normal transition outline-none focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
                    <div className="text-Gray-8 justify-start font-['Pretendard'] text-xs leading-4 font-medium">
                      이름
                    </div>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        handleProfileChange("name", e.target.value)
                      }
                      className="text-Gray-10 inline-flex items-center justify-start self-stretch rounded-lg bg-gray-100 px-4 py-3 font-['Pretendard'] text-sm leading-5 font-normal transition outline-none focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg leading-7 font-semibold text-gray-900">
                      로그아웃
                    </h3>
                    <p className="mt-2 text-base leading-6 font-normal text-slate-600">
                      현재 로그인한 계정에서 로그아웃을 진행합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="shrink-0 rounded-lg border border-red-500 bg-white px-4 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    로그아웃
                  </button>
                </div>

                <div className="h-px bg-slate-200" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg leading-7 font-semibold text-gray-900">
                      계정 탈퇴
                    </h3>
                    <p className="mt-2 text-base leading-6 font-normal text-slate-600">
                      탈퇴 시 내가 만든 프로젝트와 작성 데이터가 삭제됩니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(true)}
                    className="shrink-0 rounded-lg border border-red-500 bg-white px-4 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    탈퇴하기
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTab === "profile" && (
            <div className="inline-flex items-center justify-end self-stretch overflow-hidden">
              <button
                type="button"
                onClick={handleCloseSettings}
                className="flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 px-5 py-3 transition hover:bg-gray-200"
              >
                <div className="text-Gray-7 justify-start font-['Pretendard'] text-xs leading-4 font-medium">
                  저장
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!isSettingsOpen && (
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
            <button
              type="button"
              onClick={handleOpenSettings}
              className="flex h-10 w-full items-center justify-between rounded-2xl px-3 text-sm font-normal text-gray-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>계정 설정</span>
              </div>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </button>

            <button
              type="button"
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
      )}

      {isSettingsOpen && createPortal(modalContent, document.body)}
      {showLogoutModal && createPortal(logoutConfirmModal, document.body)}
      {showWithdrawModal && createPortal(withdrawConfirmModal, document.body)}
    </>
  );
};

export default ProfilePopup;
