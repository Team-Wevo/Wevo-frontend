import { CreditIcon, EditNameIcon } from "../../../../shared/components/icons";
import { Button } from "../../../../shared/components/Button";
import { PRESSABLE_STROKE_ICON_STATE_CLASS } from "../../../../shared/styles/buttonStateStyles";
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
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {isEditDraftDisabled && (
            <div className="flex items-center gap-1 text-xs leading-4 font-normal text-gray-600">
              <span
                className="text-success"
                aria-hidden
              >
                ●
              </span>
              <span>
                {state.activity?.label ?? "다른 팀원이 편집 중"} · 편집이 끝나면
                수정할 수 있어요.
              </span>
            </div>
          )}
          <Button
            type="draftEdit"
            onClick={onEditDraft}
            disabled={isAcquiringEditLease || isEditDraftDisabled}
            className="h-8 gap-1.5 rounded-sm px-3.5 py-1.5 text-[13px] leading-[18px] font-medium"
          >
            <EditNameIcon
              size={14}
              className={PRESSABLE_STROKE_ICON_STATE_CLASS}
            />
            {isAcquiringEditLease ? "편집권 확인 중..." : "초안 수정"}
          </Button>
        </div>
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
        evidence={state.evidence}
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
