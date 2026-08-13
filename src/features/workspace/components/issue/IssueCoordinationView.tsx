import { useMemo, useState } from "react";
import IssueCard from "./IssueCard";
import SharedProblemCard from "./SharedProblemCard";
import { isIssueDecided } from "./isIssueDecided";
import { Button } from "../../../../shared/components/Button";
import { CreditIcon } from "../../../../shared/components/icons";
import { PRESSABLE_FILL_ICON_STATE_CLASS } from "../../../../shared/styles/buttonStateStyles";
import { cn } from "../../../../shared/utils/cn";
import type {
  IssueCoordinationData,
  IssueCustomInputMap,
  IssueDecisionSubmission,
  IssueDecisionMap,
} from "./types";

interface IssueCoordinationViewProps {
  data: IssueCoordinationData;
  /** 모든 쟁점을 결정한 뒤 초안 생성 단계로 넘어간다. */
  onCreateDraft: (decisions: IssueDecisionSubmission[]) => void;
  onSubmitEvidenceAnswer: (issueId: string, content: string) => Promise<void>;
  onRequestEvidence: (issueId: string, targetUserId: number) => Promise<void>;
  isCreatingDraft?: boolean;
  canManageIssues: boolean;
  canGenerateDraft: boolean;
}

const IssueCoordinationView = ({
  data,
  onCreateDraft,
  onSubmitEvidenceAnswer,
  onRequestEvidence,
  isCreatingDraft = false,
  canManageIssues,
  canGenerateDraft,
}: IssueCoordinationViewProps) => {
  const [decisionOverrides, setDecisionOverrides] = useState<IssueDecisionMap>(
    {},
  );
  const [customInputOverrides, setCustomInputOverrides] =
    useState<IssueCustomInputMap>({});
  const persistedDecisions = useMemo<IssueDecisionMap>(
    () =>
      Object.fromEntries(
        data.issues.flatMap((issue) => {
          const selectedOption = issue.decision?.selectedOption;
          const customInput = issue.decision?.customInput;
          const matchedOption = issue.options?.find(
            (option) =>
              option.label === selectedOption ||
              Boolean(customInput && option.isCustomInput),
          );

          return matchedOption ? [[issue.id, matchedOption.id]] : [];
        }),
      ),
    [data.issues],
  );
  const persistedCustomInputs = useMemo<IssueCustomInputMap>(
    () =>
      Object.fromEntries(
        data.issues.flatMap((issue) =>
          issue.decision?.customInput
            ? [[issue.id, issue.decision.customInput]]
            : [],
        ),
      ),
    [data.issues],
  );
  const decisions = useMemo(
    () => ({ ...persistedDecisions, ...decisionOverrides }),
    [persistedDecisions, decisionOverrides],
  );
  const customInputs = useMemo(
    () => ({ ...persistedCustomInputs, ...customInputOverrides }),
    [persistedCustomInputs, customInputOverrides],
  );

  const handleSelectOption = (issueId: string, optionId: string) => {
    setDecisionOverrides((previous) => ({
      ...previous,
      [issueId]: optionId,
    }));
  };

  const handleChangeCustomInput = (issueId: string, value: string) => {
    setCustomInputOverrides((previous) => ({
      ...previous,
      [issueId]: value,
    }));
  };

  const canCreateDraft = useMemo(
    () =>
      data.issues.every((issue) =>
        isIssueDecided(issue, decisions, customInputs),
      ),
    [data.issues, decisions, customInputs],
  );

  const handleCreateDraft = () => {
    const pendingDecisions = data.issues.flatMap((issue) => {
      if (issue.resolutionType !== "choice") {
        return [];
      }

      const selectedOption = issue.options?.find(
        (option) => option.id === decisions[issue.id],
      );

      if (!selectedOption) {
        return [];
      }

      const customInput = selectedOption.isCustomInput
        ? (customInputs[issue.id] ?? "").trim()
        : undefined;
      const selectedOptionValue = selectedOption.isCustomInput
        ? undefined
        : selectedOption.label;
      const isAlreadyPersisted =
        issue.decision?.selectedOption === selectedOptionValue &&
        issue.decision?.customInput === customInput;

      return isAlreadyPersisted
        ? []
        : [
            {
              issueId: issue.id,
              selectedOption: selectedOptionValue,
              customInput,
            },
          ];
    });

    onCreateDraft(pendingDecisions);
  };

  return (
    <div className="flex flex-col gap-6">
      <span className="text-base leading-6 font-normal text-gray-900">
        쟁점 조율
      </span>

      <SharedProblemCard sharedProblem={data.sharedProblem} />

      <div className="flex flex-col gap-3">
        <h2 className="flex items-center gap-2 text-[15px] leading-6 font-semibold text-gray-900">
          <span className="bg-warning flex size-[18px] shrink-0 items-center justify-center rounded-full text-[11px] leading-[14px] font-semibold text-gray-50">
            !
          </span>
          해결이 필요한 쟁점 {data.issues.length}개
        </h2>

        {data.issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            selectedOptionId={decisions[issue.id]}
            customInput={customInputs[issue.id] ?? ""}
            isDecided={isIssueDecided(issue, decisions, customInputs)}
            onSelectOption={handleSelectOption}
            onChangeCustomInput={handleChangeCustomInput}
            onSubmitEvidenceAnswer={onSubmitEvidenceAnswer}
            onRequestEvidence={onRequestEvidence}
            readOnly={!canManageIssues}
          />
        ))}
      </div>

      {canGenerateDraft && (
        <div className="flex flex-col items-end gap-3">
          <p className="text-xs leading-[18px] font-normal text-gray-600">
            쟁점을 모두 결정하면 초안을 만들 수 있어요. (근거 요청 후에는 답변을
            기다리며 진행 가능)
          </p>

          <Button
            type="ai"
            onClick={handleCreateDraft}
            disabled={!canCreateDraft || isCreatingDraft}
            className="h-auto px-5 py-3 text-[13px] leading-5 font-medium disabled:border-transparent disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100 disabled:hover:border-transparent disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
          >
            <CreditIcon
              size={16}
              className={cn("shrink-0", PRESSABLE_FILL_ICON_STATE_CLASS)}
            />
            <span>
              {isCreatingDraft
                ? "초안 생성 시작 중..."
                : "결정 반영해 초안 만들기"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default IssueCoordinationView;
