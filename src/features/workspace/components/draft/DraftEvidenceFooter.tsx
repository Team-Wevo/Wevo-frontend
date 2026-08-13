import type { DraftViewState } from "./types";
import { Button } from "../../../../shared/components/Button";

interface DraftEvidenceFooterProps {
  state: DraftViewState;
  onOpenEvidence: () => void;
}

const DraftEvidenceFooter = ({
  state,
  onOpenEvidence,
}: DraftEvidenceFooterProps) => {
  const issueDecisionLabel = state.evidence.issueDecisionLabel ?? "쟁점 결정";

  return (
    <div className="flex w-full items-center gap-3">
      <p className="text-xs leading-4 font-normal text-gray-600">
        근거: 팀 의견 {state.evidence.teamOpinionCount}개 · {issueDecisionLabel}{" "}
        {state.evidence.issueDecisionCount}건
      </p>
      <Button
        type="draftEdit"
        className="h-8 w-fit rounded-sm px-3 py-1.5 text-xs leading-4 font-medium"
        onClick={onOpenEvidence}
      >
        근거 보기
      </Button>
    </div>
  );
};

export default DraftEvidenceFooter;
