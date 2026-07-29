import type { DraftViewState } from "./types";

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
    <div className="flex w-full items-center justify-between">
      <p className="text-xs leading-4 font-normal text-gray-600">
        근거: 팀 의견 {state.evidence.teamOpinionCount}개 · {issueDecisionLabel}{" "}
        {state.evidence.issueDecisionCount}건
      </p>
      <button
        type="button"
        className="text-main-700 text-xs leading-5 font-normal"
        onClick={onOpenEvidence}
      >
        근거 보기
      </button>
    </div>
  );
};

export default DraftEvidenceFooter;
