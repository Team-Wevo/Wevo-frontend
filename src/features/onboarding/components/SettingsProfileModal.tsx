import { useEffect } from "react";

type SettingsProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  email?: string;
  name?: string;
  loginMethod?: string;
  avatarInitial?: string;
  avatarColorClass?: string;
  contentType?: "profile" | "general";
};

const SettingsProfileModal = ({
  isOpen,
  onClose,
  title = "설정",
  description = "프로필 정보를 관리합니다.",
  email = "",
  name = "",
  loginMethod = "",
  avatarInitial = "",
  avatarColorClass = "bg-indigo-500",
  contentType = "profile",
}: SettingsProfileModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6"
      role="presentation"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-500"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {contentType === "profile" ? (
            <div className="flex flex-col gap-6 lg:flex-row">
              <div
                className={`h-24 w-24 rounded-full ${avatarColorClass} flex items-center justify-center text-3xl font-bold text-white`}
              >
                {avatarInitial}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm">이메일</label>
                  <div className="rounded bg-slate-50 p-2">{email}</div>
                </div>
                <div>
                  <label className="text-sm">이름</label>
                  <div className="rounded bg-slate-50 p-2">{name}</div>
                </div>
                {loginMethod && (
                  <div>
                    <label className="text-sm">로그인 방식</label>
                    <div className="rounded bg-slate-50 p-2">{loginMethod}</div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded bg-slate-900 px-4 py-2 text-white"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div>일반 설정 준비 중입니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsProfileModal;
