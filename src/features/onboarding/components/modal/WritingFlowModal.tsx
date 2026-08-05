import { useEffect } from "react";

interface WritingFlowModalProps {
  isOpen: boolean;
  documentType: "proposal" | "presentation";
  isStarting: boolean;
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

  return (
    <div
      className="w-full max-w-[384px] rounded-2xl bg-gray-50 p-6 shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm leading-7 text-gray-900">작성 흐름 확인</div>
          <div className="bg-main-100 rounded-full px-2 py-1">
            <div className="text-main-600 text-xs leading-4 font-medium">
              {documentTypeLabel[documentType]}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-sm leading-5 font-normal text-gray-700 transition-colors hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      {/* Guide Box */}
      <div className="bg-main-100 mt-5 flex gap-1 rounded-md p-3">
        <div className="text-main-600 h-3.5 w-3.5 flex-shrink-0">
          <svg
            viewBox="0 0 14 14"
            className="h-full w-full"
            fill="none"
            stroke="currentColor"
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
        <div className="text-main-600 text-xs leading-5 font-normal">
          결과물 유형에 맞는 작성 흐름입니다. 각 섹션의 핵심 질문과 작성
          가이드는 입력한 아이디어·전달 대상에 맞춰 제공됩니다.
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-5 flex flex-col gap-2">
        {flowSteps.map((step) => (
          <div
            key={step.id}
            className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-3"
          >
            <div className="bg-main-100 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md">
              <span className="text-main-700 text-xs leading-4 font-medium">
                {step.id}
              </span>
            </div>
            <span className="text-xs leading-5 font-normal text-gray-800">
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
          className="flex-1 cursor-pointer rounded-md border border-gray-400 bg-gray-50 px-5 py-3 text-xs leading-4 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span>←</span>
          <span className="ml-1">뒤로가기</span>
        </button>
        <button
          type="button"
          onClick={onStart}
          disabled={isStarting}
          className="bg-main-600 hover:bg-main-700 flex-1 cursor-pointer rounded-md px-5 py-3 text-xs leading-4 font-medium text-gray-50 transition-colors"
        >
          <span>{isStarting ? "생성 중..." : "이 흐름으로 시작"}</span>
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default WritingFlowModal;
