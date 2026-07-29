import type { ReactNode } from "react";
import { Button, type ButtonType } from "./Button";

interface ConfirmModalProps {
  title: string;
  description: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  confirmType?: ButtonType;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  title,
  description,
  cancelLabel = "취소",
  confirmLabel = "확인",
  confirmType = "red",
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="flex w-96 flex-col gap-4 overflow-hidden rounded-lg bg-gray-50 p-6 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-lg leading-7 font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-[13px] leading-5 font-normal text-gray-700">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="transparent"
            onClick={onCancel}
            className="rounded-sm text-xs leading-4 font-medium"
          >
            {cancelLabel}
          </Button>
          <Button
            type={confirmType}
            onClick={onConfirm}
            className="rounded-sm text-xs leading-4 font-medium"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
