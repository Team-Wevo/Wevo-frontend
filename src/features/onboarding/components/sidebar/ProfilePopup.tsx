import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronRightIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/shared/components/icons";
import {
  getMyProfile,
  updateMyProfile,
  withdrawMyAccount,
  type MyProfileResponse,
} from "@/features/auth/api/user";
import { MY_PROFILE_QUERY_KEY } from "@/features/auth/hooks/useMyProfile";
import {
  clearOAuthLoginProvider,
  getOAuthLoginProvider,
  markOAuthReauthRequired,
} from "@/features/auth/constants/oauth";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { SuccessToast } from "@/shared/components/SuccessToast";
import {
  PRESSABLE_BUTTON_STATE_CLASS,
  PRESSABLE_RECT_BUTTON_STATE_CLASS,
} from "@/shared/styles/buttonStateStyles";
import { MODAL_SCRIM_CLASS } from "@/shared/styles/modalStyles";
import { cn } from "@/shared/utils/cn";

interface ProfilePopupProps {
  initialProfile?: MyProfileResponse;
  onClose?: () => void;
  onLogoutClick?: () => void;
}

type TabKey = "profile" | "general";

const SAVE_TOAST_DURATION_MS = 3000;

const getLoginMethodLabel = () => {
  const provider = getOAuthLoginProvider();

  if (provider === "GOOGLE") return "구글";
  if (provider === "KAKAO") return "카카오";
  return "정보 없음";
};

const createInitialProfileForm = (profile?: MyProfileResponse) => ({
  email: profile?.email ?? "",
  loginMethod: getLoginMethodLabel(),
  name: profile?.name ?? "",
});

const getInitialCharacter = (name: string) => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "?";
  }

  return normalizedName.charAt(0);
};

const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | {
          code?: string;
          message?: string;
        }
      | undefined;

    if (responseData?.message) {
      return responseData.code
        ? `[${responseData.code}] ${responseData.message}`
        : responseData.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "프로필 처리 중 오류가 발생했습니다.";
};

const getWithdrawErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as { code?: string } | undefined;

    if (responseData?.code === "U003") {
      return "팀장으로 참여 중인 프로젝트가 남아 있어 탈퇴할 수 없습니다. 해당 프로젝트를 먼저 삭제(보관)한 뒤 다시 시도해 주세요.";
    }
  }

  return getApiErrorMessage(error);
};

const ProfilePopup = ({
  initialProfile,
  onClose,
  onLogoutClick,
}: ProfilePopupProps) => {
  const queryClient = useQueryClient();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [saveToastNonce, setSaveToastNonce] = useState(0);
  const [savedProfileForm, setSavedProfileForm] = useState(() =>
    createInitialProfileForm(initialProfile),
  );
  const [profileForm, setProfileForm] = useState(() =>
    createInitialProfileForm(initialProfile),
  );
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(
    null,
  );
  const [withdrawErrorMessage, setWithdrawErrorMessage] = useState<
    string | null
  >(null);
  const hasNameDraftChangesRef = useRef(false);

  const applyProfileToForm = useCallback(
    (
      profile: MyProfileResponse,
      options?: {
        preserveDraft?: boolean;
      },
    ) => {
      setSavedProfileForm((prev) => ({
        ...prev,
        email: profile.email ?? "",
        name: profile.name,
      }));

      if (options?.preserveDraft) {
        return;
      }

      setProfileForm((prev) => ({
        ...prev,
        email: profile.email ?? "",
        name: profile.name,
      }));
    },
    [],
  );

  const loadMyProfile = useCallback(async () => {
    setIsProfileLoading(true);
    setProfileErrorMessage(null);

    try {
      const profile = await getMyProfile();
      queryClient.setQueryData(MY_PROFILE_QUERY_KEY, profile);
      applyProfileToForm(profile, {
        preserveDraft: hasNameDraftChangesRef.current,
      });
      setIsProfileLoaded(true);
    } catch (error) {
      setProfileErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsProfileLoading(false);
    }
  }, [applyProfileToForm, queryClient]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMyProfile();
  }, [loadMyProfile]);

  const handleOpenSettings = () => {
    hasNameDraftChangesRef.current = false;
    setProfileForm(savedProfileForm);
    setShowSaveToast(false);
    setProfileErrorMessage(null);
    setIsSettingsOpen(true);

    if (!isProfileLoaded) {
      void loadMyProfile();
    }
  };

  const handleCloseSettings = useCallback(() => {
    setProfileForm(savedProfileForm);
    setShowSaveToast(false);
    setIsSettingsOpen(false);
  }, [savedProfileForm]);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      // 확인 모달이 열려 있으면 설정 모달이 아닌 확인 모달을 먼저 닫음
      if (showWithdrawModal) {
        setShowWithdrawModal(false);
        return;
      }

      if (showLogoutModal) {
        setShowLogoutModal(false);
        return;
      }

      handleCloseSettings();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseSettings, isSettingsOpen, showLogoutModal, showWithdrawModal]);

  useEffect(() => {
    if (!showSaveToast) return;

    const timeoutId = window.setTimeout(() => {
      setShowSaveToast(false);
    }, SAVE_TOAST_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [showSaveToast, saveToastNonce]);

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

  const handleProfileChange = (
    field: "email" | "loginMethod" | "name",
    value: string,
  ) => {
    if (field === "name") {
      hasNameDraftChangesRef.current = true;
    }

    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const normalizedProfileName = profileForm.name.trim();
  const normalizedSavedProfileName = savedProfileForm.name.trim();
  const isNameTooLong = normalizedProfileName.length > 100;
  const saveDisabledReason = isProfileLoading
    ? "프로필 정보를 불러오는 중입니다."
    : isSaveLoading
      ? "저장 중입니다."
      : normalizedProfileName.length === 0
        ? "이름을 입력해 주세요."
        : isNameTooLong
          ? "이름은 100자 이하로 입력해 주세요."
          : normalizedProfileName === normalizedSavedProfileName
            ? "현재 이름과 동일하여 저장할 내용이 없습니다."
            : null;
  const canSaveProfile =
    !isProfileLoading &&
    !isSaveLoading &&
    normalizedProfileName.length > 0 &&
    !isNameTooLong &&
    normalizedProfileName !== normalizedSavedProfileName;

  const handleSaveProfile = async () => {
    if (!canSaveProfile) return;

    setIsSaveLoading(true);
    setProfileErrorMessage(null);

    try {
      const updatedProfile = await updateMyProfile({
        name: normalizedProfileName,
      });

      queryClient.setQueryData(MY_PROFILE_QUERY_KEY, updatedProfile);
      hasNameDraftChangesRef.current = false;
      applyProfileToForm(updatedProfile);
      setShowSaveToast(true);
      // 토스트가 이미 떠 있어도 저장할 때마다 3초 타이머를 다시 시작
      setSaveToastNonce((prev) => prev + 1);
    } catch (error) {
      setProfileErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleWithdrawConfirm = async () => {
    if (isWithdrawLoading) return;

    setIsWithdrawLoading(true);
    setWithdrawErrorMessage(null);

    try {
      await withdrawMyAccount();
      const loginProvider = getOAuthLoginProvider();

      if (loginProvider === "KAKAO") {
        markOAuthReauthRequired(loginProvider);
      }

      clearOAuthLoginProvider();
      setShowWithdrawModal(false);
      setIsSettingsOpen(false);
      onClose?.();
      onLogoutClick?.();
    } catch (error) {
      setWithdrawErrorMessage(getWithdrawErrorMessage(error));
    } finally {
      setIsWithdrawLoading(false);
    }
  };

  const withdrawConfirmModal = (
    <ConfirmModal
      title="정말 탈퇴할까요?"
      description={
        <>
          <span className="block">
            탈퇴 시 개인정보는 삭제 처리되며, 작성한 내용은 보존됩니다. 되돌릴
            수 없습니다.
          </span>
          {withdrawErrorMessage && (
            <span
              role="alert"
              className="text-error mt-2 block font-medium"
            >
              {withdrawErrorMessage}
            </span>
          )}
        </>
      }
      confirmLabel={isWithdrawLoading ? "탈퇴 처리 중..." : "탈퇴하기"}
      onCancel={() => {
        if (isWithdrawLoading) return;
        setShowWithdrawModal(false);
        setWithdrawErrorMessage(null);
      }}
      onConfirm={() => {
        void handleWithdrawConfirm();
      }}
      confirmDisabled={isWithdrawLoading}
    />
  );

  const modalProfileInitial = getInitialCharacter(profileForm.name);
  const profileInitial = getInitialCharacter(savedProfileForm.name);

  const modalContent = (
    <div
      data-profile-popup="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${MODAL_SCRIM_CLASS}`}
      onClick={handleCloseSettings}
    >
      <div
        className="relative flex h-[min(500px,calc(100vh-32px))] w-full max-w-[800px] flex-col items-stretch justify-start overflow-hidden rounded-lg bg-gray-50 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)] md:h-[500px] md:flex-row md:items-start"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex w-full shrink-0 flex-col items-start justify-start gap-4 overflow-hidden bg-gray-50 px-4 py-6 md:w-60 md:self-stretch">
          <div className="text-lg leading-7 font-semibold text-[#171A23]">
            설정
          </div>
          <div className="flex flex-row items-start justify-start gap-1 self-stretch overflow-hidden md:flex-col">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`inline-flex flex-1 cursor-pointer items-center justify-center self-stretch overflow-hidden rounded-sm px-3 py-2 whitespace-nowrap transition-colors md:flex-initial md:justify-start ${
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
              className={`inline-flex flex-1 cursor-pointer items-center justify-center self-stretch overflow-hidden rounded-sm px-3 py-2 whitespace-nowrap transition-colors md:flex-initial md:justify-start ${
                activeTab === "general"
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "bg-gray-50 font-normal text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="text-base leading-[26px]">일반</div>
            </button>
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-gray-400 md:block" />

        <div className="flex min-h-0 flex-1 flex-col items-start justify-start gap-6 self-stretch overflow-y-auto p-6">
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
                  {modalProfileInitial}
                </div>
                <div className="inline-flex flex-1 flex-col items-start justify-start gap-5 overflow-hidden">
                  <div className="flex flex-col items-start justify-start gap-2 self-stretch overflow-hidden">
                    <div className="text-xs leading-4 font-medium text-gray-700">
                      이메일
                    </div>
                    <input
                      type="email"
                      value={profileForm.email || "-"}
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
                      maxLength={100}
                      disabled={isProfileLoading || isSaveLoading}
                      className="inline-flex items-center justify-start self-stretch rounded-sm bg-gray-100 px-4 py-3 text-sm leading-[22px] font-normal text-gray-900 outline-none focus:bg-gray-100"
                    />
                    {profileErrorMessage && (
                      <div className="text-xs leading-[15px] font-normal text-red-600">
                        {profileErrorMessage}
                      </div>
                    )}

                    {!profileErrorMessage &&
                      !canSaveProfile &&
                      saveDisabledReason && (
                        <div className="text-xs leading-[15px] font-normal text-gray-600">
                          {saveDisabledReason}
                        </div>
                      )}
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
                    탈퇴 시 개인정보는 삭제되며 작성 데이터는 보존됩니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setWithdrawErrorMessage(null);
                      setShowWithdrawModal(true);
                    }}
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
                  {isSaveLoading ? "저장 중..." : "저장"}
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
                {profileInitial}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-sm leading-5 font-medium text-[#1C2230]">
                  {savedProfileForm.name}
                </span>
                <span className="truncate text-xs leading-[15px] font-normal text-[#7D889C]">
                  {savedProfileForm.email || "이메일 정보 없음"}
                </span>
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
