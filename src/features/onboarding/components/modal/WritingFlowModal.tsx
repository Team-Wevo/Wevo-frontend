import { useEffect } from "react";

interface WritingFlowModalProps {
  isOpen: boolean;
  documentType: "proposal" | "presentation" | "free";
  onClose: () => void;
  onStart: () => void;
}

const flowSteps = [
  { id: 1, title: "제안 배경" },
  { id: 2, title: "문제 및 필요성" },
  { id: 3, title: "목표 및 제안 범위" },
  { id: 4, title: "제안 내용" },
  { id: 5, title: "실행 방안" },
  { id: 6, title: "기대 효과" },
];

const documentTypeLabel: Record<"proposal" | "presentation" | "free", string> =
  {
    proposal: "제안서",
    presentation: "발표 구성안",
    free: "자유주제",
  };

const WritingFlowModal = ({
  isOpen,
  documentType,
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

  return (
    <div
      className="w-full max-w-[384px] rounded-2xl bg-[#fbfaff] p-6 shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-lg leading-7 font-semibold text-[#1a1a1a]">
            작성 흐름 확인
          </div>
          <div className="rounded-full bg-[#e0d7f5] px-2 py-1">
            <div className="text-xs leading-4 font-medium text-[#5a4dd1]">
              {documentTypeLabel[documentType]}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-sm leading-5 font-normal text-[#8b8d99] transition-colors hover:text-[#3d3d3d]"
        >
          ✕
        </button>
      </div>

      {/* Guide Box */}
      <div className="mt-5 flex gap-2 rounded-lg bg-[#e0d7f5] p-4">
        <div className="h-3.5 w-3.5 flex-shrink-0">
          <svg
            viewBox="0 0 14 14"
            className="h-full w-full"
            fill="none"
            stroke="#6b5aff"
            strokeWidth="1"
          >
            <circle
              cx="7"
              cy="7"
              r="6"
            />
            <path
              d="M4.5 7l1.5 1.5 3-3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-xs leading-5 font-normal text-[#5a4dd1]">
          결과물 유형에 맞는 작성 흐름입니다. 각 섹션의 핵심 질문과 작성
          가이드는 입력한 아이디어·전달 대상에 맞춰 제공됩니다.
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-5 flex flex-col gap-2">
        {flowSteps.map((step) => (
          <div
            key={step.id}
            className="flex items-center gap-3 rounded-lg bg-[#f0f0f0] px-4 py-3"
          >
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ddd6f0]">
              <span className="text-xs leading-4 font-medium text-[#5a4dd1]">
                {step.id}
              </span>
            </div>
            <span className="text-xs leading-5 font-normal text-[#3d3d3d]">
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 cursor-pointer rounded-lg border border-[#d4d4d8] bg-[#fbfaff] px-5 py-3 text-xs leading-4 font-medium text-[#8b8d99] transition-colors hover:bg-gray-50"
        >
          <span>←</span>
          <span className="ml-1">뒤로가기</span>
        </button>
        <button
          type="button"
          onClick={onStart}
          className="flex-1 cursor-pointer rounded-lg bg-[#6b5aff] px-5 py-3 text-xs leading-4 font-medium text-[#fbfaff] transition-colors hover:bg-[#5a4dd1]"
        >
          <span>이 흐름으로 시작</span>
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default WritingFlowModal;
