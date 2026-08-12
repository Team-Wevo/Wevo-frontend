import { PencilLine } from "lucide-react";
import { CreditIcon } from "../../../../shared/components/icons";
import { Button } from "../../../../shared/components/Button";
import DraftBody from "./DraftBody";
import DraftEvidenceFooter from "./DraftEvidenceFooter";
import DraftReadabilityCard from "./DraftReadabilityCard";
import type { DraftStageViewProps, DraftViewState } from "./types";

interface GeneratedDraftHeaderProps {
  state: DraftViewState;
  onEditDraft: () => void;
  isAcquiringEditLease?: boolean;
  isEditDraftDisabled?: boolean;
}

const GeneratedDraftHeader = ({
  state,
  onEditDraft,
  isAcquiringEditLease = false,
  isEditDraftDisabled = false,
}: GeneratedDraftHeaderProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg leading-7 font-semibold text-gray-900">
          섹션 초안 · v{state.version}
        </h2>
        <span className="bg-main-50 text-main-700 flex items-center gap-1 rounded-full px-2 py-1 text-xs leading-4 font-normal">
          <CreditIcon size={14} />
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
          disabled={isAcquiringEditLease || isEditDraftDisabled}
          className="h-8 rounded-sm px-3.5 py-1.5 text-xs leading-4 font-medium"
        >
          <PencilLine className="text-main-300 h-3.5 w-3.5" />
          {isAcquiringEditLease ? "편집권 확인 중..." : "초안 수정"}
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
  isAcquiringEditLease,
  isEditDraftDisabled,
  editActionErrorMessage,
  isRequestingReadabilityCheck,
  readabilityRequestErrorMessage,
}: DraftStageViewProps) => {
  return (
    <>
      <GeneratedDraftHeader
        state={state}
        onEditDraft={onEditDraft}
        isAcquiringEditLease={isAcquiringEditLease}
        isEditDraftDisabled={isEditDraftDisabled}
      />
      {editActionErrorMessage && (
        <p className="text-error text-xs leading-4">{editActionErrorMessage}</p>
      )}
      <DraftBody
        stage={state.stage}
        draftContent={state.draftContent}
      />
      <DraftEvidenceFooter
        state={state}
        onOpenEvidence={onOpenEvidence}
      />
      <DraftReadabilityCard
        isLoading={isRequestingReadabilityCheck}
        errorMessage={readabilityRequestErrorMessage}
        onRequestReadabilityCheck={onRequestReadabilityCheck}
      />
    </>
  );
};

export default DraftGeneratedView;
