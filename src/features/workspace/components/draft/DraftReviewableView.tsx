import { Button } from "../../../../shared/components/Button";
import AiPreReviewPanel from "./AiPreReviewPanel";
import DraftBody from "./DraftBody";
import DraftEvidenceFooter from "./DraftEvidenceFooter";
import type { DraftStageViewProps } from "./types";

const DraftReviewableView = ({
  state,
  onOpenEvidence,
  onRequestReadabilityCheck,
  onMoveToReviewRequest,
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
        onCheckReadability={onRequestReadabilityCheck}
        onCreateRevision={handleCreateRevision}
      />

      <div className="flex w-full justify-end">
        <Button
          type="main"
          onClick={onMoveToReviewRequest}
          className="h-10 rounded-sm px-4 py-2 text-sm leading-7"
        >
          검토 요청으로 이동 →
        </Button>
      </div>
    </>
  );
};

export default DraftReviewableView;
