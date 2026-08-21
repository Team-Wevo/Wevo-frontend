import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../../../shared/components/Button";

interface RenameProjectModalProps {
  initialTitle: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onSubmit: (title: string) => void;
}

export const RenameProjectModal = ({
  initialTitle,
  isSubmitting = false,
  errorMessage,
  onCancel,
  onSubmit,
}: RenameProjectModalProps) => {
  const titleId = useId();
  const inputId = useId();
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0 && !isSubmitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(trimmedTitle);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 p-4"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-[380px] flex-col items-start gap-5 overflow-hidden rounded-lg bg-gray-50 p-6 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
          <h2
            id={titleId}
            className="text-lg leading-7 font-semibold text-[#171A23]"
          >
            프로젝트 이름 수정
          </h2>
          <label
            htmlFor={inputId}
            className="sr-only"
          >
            프로젝트 이름
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-start self-stretch rounded-sm bg-gray-100 px-4 py-3 text-sm leading-[22px] font-normal text-gray-900 outline-none focus:bg-gray-100 disabled:opacity-50"
          />
          {errorMessage && (
            <p className="text-error w-full text-[13px] leading-5 font-normal">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex w-full items-center justify-end gap-2 overflow-hidden">
          <Button
            type="transparent"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-auto rounded-sm border-transparent px-4 py-2 text-[13px] leading-[18px] font-medium hover:bg-gray-100"
          >
            취소
          </Button>
          <Button
            type="main"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-auto rounded-sm border-transparent px-4 py-2 text-[13px] leading-[18px] font-medium"
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
};
