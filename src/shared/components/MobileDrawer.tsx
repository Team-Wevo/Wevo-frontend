import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  label: string;
  children: ReactNode;
}

/**
 * 모바일 전용 오프캔버스 드로어. 데스크톱(md 이상)에서는 렌더되지 않으며,
 * 좌/우 사이드바를 화면에 겹쳐 여는 데 쓴다. 배경 탭·닫기 버튼·ESC 로 닫힌다.
 * 내부 사이드바(aside)의 고정 폭·테두리는 드로어 안에서 전체 폭으로 중화한다.
 */
const MobileDrawer = ({
  open,
  onClose,
  side = "left",
  label,
  children,
}: MobileDrawerProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        role="dialog"
        aria-label={label}
        className={cn(
          "absolute top-0 flex h-full w-[82%] max-w-[320px] flex-col bg-white shadow-xl",
          side === "left" ? "left-0" : "right-0",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-sm font-medium text-gray-900">{label}</span>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex cursor-pointer items-center rounded-sm text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto [&>aside]:h-full [&>aside]:w-full [&>aside]:border-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
