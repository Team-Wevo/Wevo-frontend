import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type TabType = "profile" | "general";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: TabType;
  profileContent: ReactNode;
  generalContent: ReactNode;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  defaultTab = "profile",
  profileContent,
  generalContent,
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isGeneral = activeTab === "general";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15 px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className="relative flex h-[500px] w-full max-w-[800px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex w-60 shrink-0 flex-col gap-4 border-r border-slate-200 bg-white px-4 py-6">
          <div className="px-3 text-lg font-semibold text-gray-900">설정</div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-base transition ${
                !isGeneral
                  ? "bg-slate-100 font-medium text-gray-900"
                  : "font-normal text-slate-600 hover:bg-slate-50"
              }`}
            >
              프로필
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-base transition ${
                isGeneral
                  ? "bg-slate-100 font-medium text-gray-900"
                  : "font-normal text-slate-600 hover:bg-slate-50"
              }`}
            >
              일반
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
            <div className="text-lg font-semibold text-gray-900">
              {isGeneral ? "일반" : "프로필"}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isGeneral ? generalContent : profileContent}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
