import { useEffect } from "react";
import { CreditIcon } from "@/shared/components/icons";
import {
  PRESENTATION_SECTIONS,
  PROPOSAL_SECTIONS,
} from "@/shared/types/documentType";

interface WritingFlowModalProps {
  isOpen: boolean;
  documentType: "proposal" | "presentation";
  isStarting: boolean;
  onClose: () => void;
  onStart: () => void;
}

const flowStepsByDocumentType = {
  proposal: PROPOSAL_SECTIONS,
  presentation: PRESENTATION_SECTIONS,
} as const;

const documentTypeLabel: Record<"proposal" | "presentation", string> = {
  proposal: "제안서",
  presentation: "발표 구성안",
};

const WritingFlowModal = ({
  isOpen,
  documentType,
  isStarting,
  onClose,
  onStart,
}: WritingFlowModalProps) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const flowSteps = flowStepsByDocumentType[documentType];

  return (
    <div
      className="flex max-h-[calc(100dvh-32px)] w-full max-w-[440px] flex-col gap-5 overflow-y-auto rounded-[16px] bg-gray-50 p-6 shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[18px] leading-7 font-semibold text-[#171a23]">
            작성 흐름 확인
          </div>
          <div className="bg-main-50 rounded-full px-2 py-1">
            <div className="text-main-700 text-xs leading-4 font-medium">
              {documentTypeLabel[documentType]}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-sm leading-[22px] font-normal text-gray-700 transition-colors hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      {/* Guide Box */}
      <div className="bg-main-50 flex items-start gap-2 rounded-[8px] px-4 py-3">
        <CreditIcon
          size={14}
          className="shrink-0"
        />
        <div className="text-main-700 flex-1 text-[13px] leading-5 font-normal">
          결과물 유형에 맞는 작성 흐름입니다. 각 섹션의 핵심 질문과 작성
          가이드는 입력한 아이디어·전달 대상에 맞춰 제공됩니다.
        </div>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-2">
        {flowSteps.map((title, index) => (
          <div
            key={title}
            className="flex h-12 items-center gap-3 rounded-[8px] bg-gray-100 px-4 py-3"
          >
            <div className="bg-main-100 flex size-6 shrink-0 items-center justify-center rounded-full">
              <span className="text-main-700 text-xs leading-4 font-medium">
                {index + 1}
              </span>
            </div>
            <span className="text-[13px] leading-5 font-normal text-gray-800">
              {title}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-gray-400 bg-gray-50 px-5 py-3 text-[13px] leading-[18px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span>←</span>
          <span>뒤로가기</span>
        </button>
        <button
          type="button"
          onClick={onStart}
          disabled={isStarting}
          className="bg-main-600 hover:bg-main-700 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[8px] px-5 py-3 text-[13px] leading-[18px] font-medium text-gray-50 transition-colors disabled:cursor-not-allowed"
        >
          <span>{isStarting ? "생성 중..." : "이 흐름으로 시작"}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default WritingFlowModal;
