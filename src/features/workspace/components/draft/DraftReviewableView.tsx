import { Button } from "../../../../shared/components/Button";
import AiPreReviewPanel from "./AiPreReviewPanel";
import DraftBody from "./DraftBody";
import DraftEvidenceFooter from "./DraftEvidenceFooter";
import type { DraftStageViewProps } from "./types";

const DraftReviewableView = ({
  state,
  onOpenEvidence,
  onMoveToReviewRequest,
  isMovingToReviewRequest,
  moveToReviewRequestErrorMessage,
  readabilityRequestErrorMessage,
  onApplyRevision,
  onKeepRevision,
  isApplyingRevision,
  applyRevisionErrorMessage,
  canApplyRevision,
  canMoveToReviewRequest,
}: DraftStageViewProps) => {
  const preReviewData = state.preReview ?? {
    perspectiveLabel: "처음 읽는 사람 관점",
    results: [],
  };

  const handleCreateRevision = () => {
    // TODO: 수정안 생성 API 연결
  };

  return (
    <>
      <DraftBody
        stage={state.stage}
        draftContent={state.draftContent}
        fitContent
      />
      <DraftEvidenceFooter
        state={state}
        onOpenEvidence={onOpenEvidence}
      />

      <AiPreReviewPanel
        data={preReviewData}
        onCreateRevision={handleCreateRevision}
        onApplyRevision={onApplyRevision}
        onKeepRevision={onKeepRevision}
        readabilityErrorMessage={readabilityRequestErrorMessage}
        isApplyingRevision={isApplyingRevision}
        applyRevisionErrorMessage={applyRevisionErrorMessage}
        canApplyRevision={canApplyRevision}
      />

      {canMoveToReviewRequest && (
        <div className="flex w-full items-center justify-end gap-3">
          {moveToReviewRequestErrorMessage && (
            <span className="text-error text-xs">
              {moveToReviewRequestErrorMessage}
            </span>
          )}
          <Button
            type="main"
            onClick={onMoveToReviewRequest}
            disabled={isMovingToReviewRequest}
            className="h-10 rounded-sm px-4 py-2 text-sm leading-7"
          >
            {isMovingToReviewRequest ? "이동 중..." : "검토 요청으로 이동 →"}
          </Button>
        </div>
      )}
    </>
  );
};

export default DraftReviewableView;
