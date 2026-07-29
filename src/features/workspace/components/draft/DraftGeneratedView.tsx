import { PencilLine, Sparkle } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import DraftBody from "./DraftBody";
import DraftEvidenceFooter from "./DraftEvidenceFooter";
import DraftReadabilityCard from "./DraftReadabilityCard";
import type { DraftStageViewProps, DraftViewState } from "./types";

interface GeneratedDraftHeaderProps {
  state: DraftViewState;
  onEditDraft: () => void;
}

const GeneratedDraftHeader = ({
  state,
  onEditDraft,
}: GeneratedDraftHeaderProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg leading-7 font-semibold text-gray-900">
          섹션 초안 · v{state.version}
        </h2>
        <span className="bg-main-50 text-main-700 flex items-center gap-1 rounded-full px-2 py-1 text-xs leading-4 font-normal">
          <Sparkle
            strokeWidth={1}
            className="h-3.5 w-3.5"
          />
          {state.sourceLabel}
        </span>
      </div>

      <div className="flex w-full items-end justify-between gap-4">
        <p className="text-xs leading-5 font-normal font-semibold text-gray-900">
          {state.summary}
        </p>
        <Button
          type="outline"
          onClick={onEditDraft}
          className="h-8 rounded-sm px-3.5 py-1.5 text-xs leading-4 font-medium"
        >
          <PencilLine className="text-main-300 h-3.5 w-3.5" />
          초안 수정
        </Button>
      </div>
    </div>
  );
};

const DraftGeneratedView = ({
  state,
  onEditDraft,
  onOpenEvidence,
  onRequestReadabilityCheck,
}: DraftStageViewProps) => {
  return (
    <>
      <GeneratedDraftHeader
        state={state}
        onEditDraft={onEditDraft}
      />
      <DraftBody
        stage={state.stage}
        draftContent={state.draftContent}
      />
      <DraftEvidenceFooter
        state={state}
        onOpenEvidence={onOpenEvidence}
      />
      <DraftReadabilityCard
        onRequestReadabilityCheck={onRequestReadabilityCheck}
      />
    </>
  );
};

export default DraftGeneratedView;
