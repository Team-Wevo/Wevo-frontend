import { useId, type ReactNode } from "react";
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
  const titleId = useId();
  const descriptionId = useId();

  return (
    <div
      data-profile-popup="true"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20"
      onClick={onCancel}
    >
      <div
        className="flex w-[380px] flex-col items-start gap-5 overflow-hidden rounded-lg bg-gray-50 p-6 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
          <h2
            id={titleId}
            className="text-lg leading-7 font-semibold text-[#171A23]"
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className="w-full text-[13px] leading-5 font-normal text-gray-700"
          >
            {description}
          </p>
        </div>

        <div className="flex w-full items-center justify-end gap-2 overflow-hidden">
          <Button
            type="transparent"
            onClick={onCancel}
            className="h-auto rounded-sm border-transparent px-4 py-2 text-[13px] leading-[18px] font-medium hover:bg-gray-100"
          >
            {cancelLabel}
          </Button>
          <Button
            type={confirmType}
            onClick={onConfirm}
            className="h-auto rounded-sm border-transparent px-4 py-2 text-[13px] leading-[18px] font-medium"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
