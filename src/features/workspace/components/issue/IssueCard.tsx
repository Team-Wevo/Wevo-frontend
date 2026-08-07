import { useEffect, useRef } from "react";
import { Sparkle } from "lucide-react";
import SectionBlock from "../blocks/SectionBlock";
import {
  PRESSABLE_CHIP_STATE_CLASS,
  SELECTED_CHIP_STATE_CLASS,
} from "../../../../shared/styles/buttonStateStyles";
import { cn } from "../../../../shared/utils/cn";
import type { WorkspaceIssue } from "./types";

const MAX_CUSTOM_INPUT_LENGTH = 100;

interface IssueCardProps {
  issue: WorkspaceIssue;
  selectedOptionId?: string;
  customInput: string;
  isDecided: boolean;
  onSelectOption: (issueId: string, optionId: string) => void;
  onChangeCustomInput: (issueId: string, value: string) => void;
}

const IssueCard = ({
  issue,
  selectedOptionId,
  customInput,
  isDecided,
  onSelectOption,
  onChangeCustomInput,
}: IssueCardProps) => {
  const customInputRef = useRef<HTMLInputElement>(null);

  const isChoice = issue.resolutionType === "choice";
  const selectedOption = issue.options?.find(
    (option) => option.id === selectedOptionId,
  );
  const isCustomInputOpen = Boolean(selectedOption?.isCustomInput);
  // 결정이 남은 선택형 쟁점만 주의를 끌도록 테두리를 강조한다.
  const needsDecision = isChoice && !isDecided;

  useEffect(() => {
    if (isCustomInputOpen) {
      customInputRef.current?.focus();
    }
  }, [isCustomInputOpen]);

  return (
    <SectionBlock className={cn(needsDecision && "border-warning/40")}>
      <div className="flex flex-col gap-3">
        <h3 className="text-[13px] leading-5 font-semibold text-gray-900">
          {issue.order}. {issue.title}
        </h3>

        {issue.opinions.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {issue.opinions.map((opinion) => (
              <li
                key={opinion.memberName}
                className="flex items-start gap-3"
              >
                <span className="w-11 shrink-0 text-xs leading-5 font-normal text-gray-600">
                  {opinion.memberName}
                </span>
                <span className="text-[13px] leading-5 font-normal text-gray-900">
                  {opinion.content}
                </span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-main-600 flex items-center gap-1.5 text-[13px] leading-5 font-normal">
          <Sparkle className="size-4 shrink-0" />
          {issue.aiHint}
        </p>

        {isChoice && issue.options && (
          <div
            role="radiogroup"
            aria-label={`${issue.order}. ${issue.title}`}
            className="flex flex-wrap items-center gap-2"
          >
            {issue.options.map((option) => {
              const isSelected = selectedOptionId === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectOption(issue.id, option.id)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] leading-5 font-normal transition-colors",
                    isSelected
                      ? SELECTED_CHIP_STATE_CLASS
                      : PRESSABLE_CHIP_STATE_CLASS,
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {isCustomInputOpen && (
          <div className="flex items-center gap-3 rounded-sm border border-gray-400 bg-gray-50 px-4 py-2.5">
            <input
              ref={customInputRef}
              type="text"
              value={customInput}
              onChange={(event) =>
                onChangeCustomInput(
                  issue.id,
                  event.target.value.slice(0, MAX_CUSTOM_INPUT_LENGTH),
                )
              }
              maxLength={MAX_CUSTOM_INPUT_LENGTH}
              placeholder="집중할 핵심 문제를 직접 적어주세요."
              aria-label={`${issue.order}번 쟁점 직접 입력`}
              className="flex-1 text-[13px] leading-5 text-gray-900 placeholder:text-gray-500 focus:outline-none"
            />
            <span className="shrink-0 text-xs leading-4 text-gray-600">
              {customInput.length} / {MAX_CUSTOM_INPUT_LENGTH}
            </span>
          </div>
        )}

        {issue.evidenceRequest && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-main-600 text-[13px] leading-5 font-normal">
              {issue.evidenceRequest.message}
            </span>
            <span className="shrink-0 text-xs leading-5 font-normal text-gray-600">
              추가 질문 {issue.evidenceRequest.questionCount}회
            </span>
          </div>
        )}
      </div>
    </SectionBlock>
  );
};

export default IssueCard;
