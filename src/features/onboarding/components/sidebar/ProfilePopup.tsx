import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronRightIcon,
  CreditIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/shared/components/icons";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { SuccessToast } from "@/shared/components/SuccessToast";
import {
  PRESSABLE_BUTTON_STATE_CLASS,
  PRESSABLE_RECT_BUTTON_STATE_CLASS,
} from "@/shared/styles/buttonStateStyles";
import { MODAL_SCRIM_CLASS } from "@/shared/styles/modalStyles";
import { cn } from "@/shared/utils/cn";

interface ProfilePopupProps {
  onClose?: () => void;
  onLogoutClick?: () => void;
}

type TabKey = "profile" | "general";

const SAVE_TOAST_DURATION_MS = 3000;

const INITIAL_PROFILE_FORM = {
  email: "alexjee85@gmail.com",
  loginMethod: "카카오",
  name: "지현구",
};

const ProfilePopup = ({ onClose, onLogoutClick }: ProfilePopupProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [savedProfileForm, setSavedProfileForm] =
    useState(INITIAL_PROFILE_FORM);
  const [profileForm, setProfileForm] = useState(INITIAL_PROFILE_FORM);

  const handleOpenSettings = () => {
    setProfileForm(savedProfileForm);
    setShowSaveToast(false);
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = useCallback(() => {
    setProfileForm(savedProfileForm);
    setShowSaveToast(false);
    setIsSettingsOpen(false);
  }, [savedProfileForm]);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseSettings, isSettingsOpen]);

  useEffect(() => {
    if (!showSaveToast) return;

    const timeoutId = window.setTimeout(() => {
      setShowSaveToast(false);
    }, SAVE_TOAST_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [showSaveToast]);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    setIsSettingsOpen(false);
    onClose?.();
    onLogoutClick?.();
  };

  const logoutConfirmModal = (
    <ConfirmModal
      title="로그아웃 할까요?"
      description="현재 계정에서 로그아웃됩니다."
      confirmLabel="로그아웃"
      onCancel={() => setShowLogoutModal(false)}
      onConfirm={handleLogoutConfirm}
    />
  );

  const withdrawConfirmModal = (
    <ConfirmModal
      title="정말 탈퇴할까요?"
      description="탈퇴 시 내가 만든 프로젝트와 작성 데이터가 모두 삭제되며, 되돌릴 수 없습니다."
      confirmLabel="탈퇴하기"
      onCancel={() => setShowWithdrawModal(false)}
      onConfirm={() => setShowWithdrawModal(false)}
    />
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

  const normalizedProfileName = profileForm.name.trim();
  const canSaveProfile =
    normalizedProfileName.length > 0 &&
    normalizedProfileName !== savedProfileForm.name.trim();

  const handleSaveProfile = () => {
    if (!canSaveProfile) return;

    const nextProfileForm = {
      ...profileForm,
      name: normalizedProfileName,
    };

    setSavedProfileForm(nextProfileForm);
    setProfileForm(nextProfileForm);
    setShowSaveToast(true);
  };

  const modalContent = (
    <div
      data-profile-popup="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${MODAL_SCRIM_CLASS}`}
    >
      <div
        className="relative inline-flex h-[500px] w-[800px] items-start justify-start overflow-hidden rounded-lg bg-gray-50 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="inline-flex w-60 flex-col items-start justify-start gap-4 self-stretch overflow-hidden bg-gray-50 px-4 py-6">
          <div className="text-lg leading-7 font-semibold text-[#171A23]">
            설정
          </div>
          <div className="flex flex-col items-start justify-start gap-1 self-stretch overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`inline-flex cursor-pointer items-center justify-start self-stretch overflow-hidden rounded-sm px-3 py-2 transition-colors ${
                activeTab === "profile"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "bg-gray-50 font-normal text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="text-base leading-[26px]">프로필</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`inline-flex cursor-pointer items-center justify-start self-stretch overflow-hidden rounded-sm px-3 py-2 transition-colors ${
                activeTab === "general"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "bg-gray-50 font-normal text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="text-base leading-[26px]">일반</div>
            </button>
          </div>
        </div>

        <div className="w-px self-stretch bg-gray-400" />

        <div className="inline-flex flex-1 flex-col items-start justify-start gap-6 self-stretch overflow-hidden p-6">
          {activeTab === "profile" && (
            <div className="inline-flex items-center justify-between self-stretch overflow-hidden">
              <div className="text-lg leading-7 font-semibold text-gray-900">
                프로필
              </div>
              <button
                type="button"
                onClick={handleCloseSettings}
                className="cursor-pointer text-sm leading-[22px] font-normal text-gray-700 transition-colors hover:text-gray-900"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === "general" && (
            <div className="inline-flex items-center justify-between self-stretch overflow-hidden">
              <div className="text-lg leading-7 font-semibold text-gray-900">
                일반
              </div>
              <button
                type="button"
                onClick={handleCloseSettings}
                className="cursor-pointer text-sm leading-[22px] font-normal text-gray-700 transition-colors hover:text-gray-900"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex-1 self-stretch overflow-y-auto">
            {activeTab === "profile" ? (
              <div className="inline-flex w-full items-start justify-start gap-6 overflow-hidden">
                <div className="bg-main-600 flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full text-[32px] leading-[42px] font-bold text-gray-50">
                  지
                </div>
                <div className="inline-flex flex-1 flex-col items-start justify-start gap-5 overflow-hidden">
                  <div className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
                    <div className="text-xs leading-4 font-medium text-gray-700">
                      이메일
                    </div>
                    <input
                      type="email"
                      value={profileForm.email}
                      readOnly
                      className="inline-flex cursor-default items-center justify-start self-stretch rounded-sm bg-gray-100 px-4 py-3 text-sm leading-[22px] font-normal text-gray-600 outline-none"
                    />
                    <div className="text-xs leading-[15px] font-normal text-gray-700">
                      소셜 로그인 이메일은 변경할 수 없습니다.
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
                    <div className="text-xs leading-4 font-medium text-gray-700">
                      로그인 방식
                    </div>
                    <input
                      type="text"
                      value={profileForm.loginMethod}
                      readOnly
                      className="inline-flex cursor-default items-center justify-start self-stretch rounded-sm bg-gray-100 px-4 py-3 text-sm leading-[22px] font-normal text-gray-900 outline-none"
                    />
                  </div>

                  <div className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
                    <div className="text-xs leading-4 font-medium text-gray-700">
                      이름
                    </div>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        handleProfileChange("name", e.target.value)
                      }
                      className="inline-flex items-center justify-start self-stretch rounded-sm bg-gray-100 px-4 py-3 text-sm leading-[22px] font-normal text-gray-900 outline-none focus:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4 overflow-hidden">
                <div className="relative h-[100px] w-full shrink-0 overflow-hidden">
                  <h3 className="absolute top-[9px] left-0 text-lg leading-7 font-semibold text-gray-900">
                    로그아웃
                  </h3>
                  <p className="absolute top-[41px] left-0 text-base leading-[26px] font-normal text-gray-700">
                    현재 로그인한 계정에서 로그아웃을 진행합니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="border-error text-error hover:bg-error absolute top-[38px] right-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-sm border bg-gray-50 px-4 py-2 text-[13px] leading-[18px] font-medium transition-colors hover:text-gray-50"
                  >
                    로그아웃
                  </button>
                </div>

                <div className="h-px w-full shrink-0 bg-gray-400" />

                <div className="relative h-[100px] w-full shrink-0 overflow-hidden">
                  <h3 className="absolute top-[9px] left-0 text-lg leading-7 font-semibold text-gray-900">
                    계정 탈퇴
                  </h3>
                  <p className="absolute top-[41px] left-0 text-base leading-[26px] font-normal text-gray-700">
                    탈퇴 시 내가 만든 프로젝트와 작성 데이터가 삭제됩니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(true)}
                    className="border-error text-error hover:bg-error absolute top-[38px] right-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-sm border bg-gray-50 px-4 py-2 text-[13px] leading-[18px] font-medium transition-colors hover:text-gray-50"
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
                onClick={handleSaveProfile}
                disabled={!canSaveProfile}
                className={cn(
                  "flex cursor-pointer items-center justify-center overflow-hidden rounded-sm border px-5 py-3 disabled:cursor-not-allowed disabled:opacity-100",
                  PRESSABLE_BUTTON_STATE_CLASS,
                  PRESSABLE_RECT_BUTTON_STATE_CLASS,
                  "disabled:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:hover:border-transparent disabled:hover:bg-gray-100 disabled:hover:text-gray-600",
                )}
              >
                <div className="text-[13px] leading-[18px] font-medium">
                  저장
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {showSaveToast && (
        <SuccessToast
          message="프로필이 저장되었습니다"
          className="absolute bottom-[40px] left-1/2 z-10 -translate-x-1/2"
        />
      )}
    </div>
  );

  return (
    <>
      {!isSettingsOpen && (
        <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-17 left-1/2 z-50 flex w-full origin-bottom -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-[#C6CEDA] bg-[#FCFCFD] shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.1)] transition-all duration-200 ease-out">
          <div className="flex w-full flex-col gap-3 border-b border-[#C6CEDA] px-4 pt-4 pb-3">
            <div className="flex w-full items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#6B5EF0] text-xs font-medium text-[#FCFCFD]">
                현
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm leading-5 font-medium text-[#1C2230]">
                  지현구
                </span>
                <span className="truncate text-xs leading-[15px] font-normal text-[#7D889C]">
                  alexjoe85@gmail.com
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 rounded-lg bg-[#F5F7FA] px-3 py-2">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-1">
                  <CreditIcon size={17} />
                  <span className="text-[13px] leading-5 font-normal text-[#596579]">
                    크레딧
                  </span>
                </div>
                <div className="flex items-center gap-1 leading-5">
                  <span className="text-sm font-medium text-[#7C6FF7]">18</span>
                  <span className="text-[13px] font-normal text-[#1C2230]">
                    /
                  </span>
                  <span className="text-[13px] font-normal text-[#1C2230]">
                    25
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#C6CEDA]">
                <div className="h-full w-[72%] rounded-full bg-[#6B5EF0]" />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1 bg-[#FCFCFD] p-2">
            <button
              type="button"
              onClick={handleOpenSettings}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm leading-[22px] font-normal text-[#596579] transition-colors hover:bg-[#F4F2FF]"
            >
              <div className="flex items-center gap-1">
                <SettingsIcon size={16} />
                <span>계정 설정</span>
              </div>
              <ChevronRightIcon size={10} />
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm leading-[22px] font-normal text-[#DC3E26] transition-colors hover:bg-[#F4F2FF]"
            >
              <LogoutIcon
                size={16}
                color="#DC3E26"
              />
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
