import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { SectionDraftEvidenceResponse } from "../../api/getSectionDraftEvidence";

interface DraftEvidenceModalProps {
  data?: SectionDraftEvidenceResponse;
  isLoading: boolean;
  errorMessage?: string | null;
  onClose: () => void;
}

const DraftEvidenceModal = ({
  data,
  isLoading,
  errorMessage = null,
  onClose,
}: DraftEvidenceModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="draft-evidence-title"
        className="flex max-h-[min(640px,calc(100vh-32px))] w-[372px] flex-col overflow-hidden rounded-[12px] border border-gray-400 bg-gray-50 shadow-[0_12px_32px_rgba(28,34,48,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-300 px-4">
          <h2
            id="draft-evidence-title"
            className="text-base leading-[26px] font-medium text-gray-900"
          >
            초안의 근거
          </h2>
          <button
            type="button"
            aria-label="초안의 근거 닫기"
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center text-xl leading-none font-light text-gray-600"
          >
            ×
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
          {isLoading && (
            <p className="py-8 text-center text-[13px] leading-5 text-gray-600">
              초안의 근거를 불러오고 있어요.
            </p>
          )}

          {!isLoading && errorMessage && (
            <p className="text-error rounded-lg bg-red-50 p-4 text-[13px] leading-5">
              {errorMessage}
            </p>
          )}

          {!isLoading && !errorMessage && data && (
            <>
              <div className="flex flex-col gap-2">
                <h3 className="text-[12px] leading-[18px] font-medium text-gray-700">
                  팀장이 확정한 결정
                </h3>
                <div className="border-main-300 bg-main-50 text-main-700 rounded-lg border px-3 py-2 text-[12px] leading-5">
                  ✓{" "}
                  {data.consensusSummary?.trim() || "확정된 팀 합의가 없어요."}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-[12px] leading-[18px] font-medium text-gray-700">
                  반영된 팀 의견 {data.opinions.length}개
                </h3>
                <div className="flex flex-col gap-1">
                  {data.opinions.map((opinion) => (
                    <article
                      key={opinion.opinionId}
                      className="flex flex-col gap-1 rounded-lg bg-gray-200 px-3 py-2"
                    >
                      <span className="text-[11px] leading-4 text-gray-600">
                        {opinion.authorName}
                      </span>
                      <p className="text-[12px] leading-5 text-gray-800">
                        {opinion.content}
                      </p>
                    </article>
                  ))}
                  {data.opinions.length === 0 && (
                    <p className="rounded-lg bg-gray-100 px-3 py-2 text-[12px] leading-5 text-gray-600">
                      반영된 팀 의견이 없어요.
                    </p>
                  )}
                </div>
              </div>

              {data.decisions.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-[12px] leading-[18px] font-medium text-gray-700">
                    확정 결정 {data.decisions.length}건
                  </h3>
                  <div className="flex flex-col gap-1">
                    {data.decisions.map((decision) => (
                      <article
                        key={decision.issueId}
                        className="flex flex-col gap-1 rounded-lg bg-gray-200 px-3 py-2"
                      >
                        <span className="text-[11px] leading-4 text-gray-600">
                          {decision.question}
                        </span>
                        <p className="text-[12px] leading-5 text-gray-800">
                          {decision.decision}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {data.gapAnswers.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-[12px] leading-[18px] font-medium text-gray-700">
                    보충 근거 {data.gapAnswers.length}건
                  </h3>
                  <div className="flex flex-col gap-1">
                    {data.gapAnswers.map((answer) => (
                      <article
                        key={answer.answerId}
                        className="flex flex-col gap-1 rounded-lg bg-gray-200 px-3 py-2"
                      >
                        <span className="text-[11px] leading-4 text-gray-600">
                          {answer.authorName}
                          {answer.inherited ? " · 이전 단계에서 반영" : ""}
                        </span>
                        <p className="text-[12px] leading-5 text-gray-800">
                          {answer.content}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default DraftEvidenceModal;
