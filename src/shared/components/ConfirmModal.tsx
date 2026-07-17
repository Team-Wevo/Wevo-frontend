import type { ReactNode } from "react";

interface ConfirmModalProps {
  icon?: ReactNode;
  title: string;
  description: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  icon,
  title,
  description,
  cancelLabel = "취소",
  confirmLabel = "확인",
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="flex w-96 flex-col gap-4 rounded-lg border-[0.8px] border-[#CDD0DF] bg-white p-6 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.10),0_20px_25px_-5px_rgba(0,0,0,0.10)]"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
            {icon}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h2 className="text-[16px] leading-[24px] font-bold text-[#1A1D2E]">
            {title}
          </h2>
          <p className="text-[14px] leading-[22.75px] font-normal text-[#5C6080]">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md flex items-center justify-center bg-white px-4 py-2 text-sm font-normal text-[#5C6080]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md flex items-center justify-center bg-[#FB2C36] px-4 py-2 text-sm font-normal text-white transition-colors hover:bg-[#FB2C36]/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
