import { useEffect, useRef, useState } from "react";
import SectionBlock from "../blocks/SectionBlock";
import { Button } from "../../../../shared/components/Button";
import { CreditIcon } from "../../../../shared/components/icons";
import {
  PRESSABLE_CHIP_STATE_CLASS,
  SELECTED_CHIP_STATE_CLASS,
} from "../../../../shared/styles/buttonStateStyles";
import { cn } from "../../../../shared/utils/cn";
import type { WorkspaceIssue } from "./types";

const MAX_CUSTOM_INPUT_LENGTH = 100;
const MAX_EVIDENCE_ANSWER_LENGTH = 1000;

interface IssueCardProps {
  issue: WorkspaceIssue;
  selectedOptionId?: string;
  customInput: string;
  isDecided: boolean;
  onSelectOption: (issueId: string, optionId: string) => void;
  onChangeCustomInput: (issueId: string, value: string) => void;
  onSubmitEvidenceAnswer: (issueId: string, content: string) => Promise<void>;
  onRequestEvidence: (issueId: string, targetUserId: number) => Promise<void>;
  readOnly?: boolean;
}

const IssueCard = ({
  issue,
  selectedOptionId,
  customInput,
  isDecided,
  onSelectOption,
  onChangeCustomInput,
  onSubmitEvidenceAnswer,
  onRequestEvidence,
  readOnly = false,
}: IssueCardProps) => {
  const customInputRef = useRef<HTMLInputElement>(null);
  const [evidenceAnswer, setEvidenceAnswer] = useState("");
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [evidenceErrorMessage, setEvidenceErrorMessage] = useState<
    string | null
  >(null);
  const [requestingEvidenceUserId, setRequestingEvidenceUserId] = useState<
    number | null
  >(null);

  const isChoice = issue.resolutionType === "choice";
  const selectedOption = issue.options?.find(
    (option) => option.id === selectedOptionId,
  );
  const isCustomInputOpen = Boolean(selectedOption?.isCustomInput);
  const needsDecision = !isDecided;
  const evidenceRequestTargets = issue.opinions.filter(
    (
      opinion,
      index,
      opinions,
    ): opinion is typeof opinion & { authorUserId: number } =>
      typeof opinion.authorUserId === "number" &&
      opinions.findIndex(
        (candidate) => candidate.authorUserId === opinion.authorUserId,
      ) === index,
  );

  useEffect(() => {
    if (isCustomInputOpen && !readOnly) {
      customInputRef.current?.focus();
    }
  }, [isCustomInputOpen, readOnly]);

  const handleSubmitEvidenceAnswer = async () => {
    const normalizedAnswer = evidenceAnswer.trim();

    if (!normalizedAnswer || isSubmittingEvidence) {
      return;
    }

    setIsSubmittingEvidence(true);
    setEvidenceErrorMessage(null);

    try {
      await onSubmitEvidenceAnswer(issue.id, normalizedAnswer);
      setEvidenceAnswer("");
    } catch (error) {
      setEvidenceErrorMessage(
        error instanceof Error
          ? error.message
          : "추가 근거 답변을 등록하지 못했습니다.",
      );
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleRequestEvidence = async (targetUserId: number) => {
    if (requestingEvidenceUserId !== null) {
      return;
    }

    setRequestingEvidenceUserId(targetUserId);
    setEvidenceErrorMessage(null);

    try {
      await onRequestEvidence(issue.id, targetUserId);
    } catch (error) {
      setEvidenceErrorMessage(
        error instanceof Error
          ? error.message
          : "추가 근거를 요청하지 못했습니다.",
      );
    } finally {
      setRequestingEvidenceUserId(null);
    }
  };

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
          <CreditIcon
            size={16}
            className="shrink-0"
          />
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
                  disabled={readOnly}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[13px] leading-5 font-normal transition-colors",
                    readOnly ? "cursor-default" : "cursor-pointer",
                    isSelected
                      ? SELECTED_CHIP_STATE_CLASS
                      : readOnly
                        ? "border-gray-400 bg-gray-50 text-gray-700"
                        : PRESSABLE_CHIP_STATE_CLASS,
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {isCustomInputOpen && !readOnly && (
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
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-main-600 text-[13px] leading-5 font-normal">
                {issue.evidenceRequest.message}
              </span>
              <span className="shrink-0 text-xs leading-5 font-normal text-gray-600">
                추가 질문 {issue.evidenceRequest.questionCount}회
              </span>
            </div>

            {issue.evidenceRequest.answer ? (
              <div className="bg-main-50 rounded-sm px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] leading-5 font-semibold text-gray-900">
                    {issue.evidenceRequest.answer.authorName} 님의 추가 근거
                  </span>
                  <span className="text-success shrink-0 text-xs leading-5 font-medium">
                    답변 완료
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-5 font-normal break-words whitespace-pre-wrap text-gray-800">
                  {issue.evidenceRequest.answer.content}
                </p>
              </div>
            ) : issue.evidenceRequest.requested && readOnly ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={evidenceAnswer}
                  onChange={(event) =>
                    setEvidenceAnswer(
                      event.target.value.slice(0, MAX_EVIDENCE_ANSWER_LENGTH),
                    )
                  }
                  maxLength={MAX_EVIDENCE_ANSWER_LENGTH}
                  rows={3}
                  placeholder="요청받은 추가 근거를 작성해 주세요."
                  aria-label={`${issue.order}번 쟁점 추가 근거 답변`}
                  className="focus:border-main-500 min-h-20 w-full resize-none rounded-sm border border-gray-400 bg-gray-50 px-4 py-3 text-[13px] leading-5 text-gray-900 placeholder:text-gray-500 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs leading-5 font-normal text-gray-600">
                      추가 근거를 요청받은 팀원만 답변할 수 있어요.
                    </span>
                    {evidenceErrorMessage && (
                      <span className="text-error text-xs leading-5 font-normal">
                        {evidenceErrorMessage}
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs leading-5 font-normal text-gray-600">
                      {evidenceAnswer.length} / {MAX_EVIDENCE_ANSWER_LENGTH}
                    </span>
                    <Button
                      type="pressableStrong"
                      onClick={() => void handleSubmitEvidenceAnswer()}
                      disabled={
                        evidenceAnswer.trim().length === 0 ||
                        isSubmittingEvidence
                      }
                      className="h-8 px-3 py-1.5 text-[13px] leading-5"
                    >
                      {isSubmittingEvidence ? "등록 중..." : "답변 등록"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : issue.evidenceRequest.requested ? (
              <span className="text-xs leading-5 font-normal text-gray-600">
                요청받은 팀원의 답변을 기다리고 있어요. 답변 전에도 초안을 만들
                수 있어요.
              </span>
            ) : !readOnly ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs leading-5 font-normal text-gray-600">
                  추가 근거를 요청할 팀원을 선택해 주세요.
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {evidenceRequestTargets.map((opinion) => (
                    <button
                      key={opinion.authorUserId}
                      type="button"
                      onClick={() =>
                        void handleRequestEvidence(opinion.authorUserId)
                      }
                      disabled={requestingEvidenceUserId !== null}
                      className={cn(
                        "cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] leading-5 font-normal transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                        PRESSABLE_CHIP_STATE_CLASS,
                      )}
                    >
                      {requestingEvidenceUserId === opinion.authorUserId
                        ? "요청 중..."
                        : `${opinion.memberName} 님에게 요청`}
                    </button>
                  ))}
                </div>
                {evidenceRequestTargets.length === 0 && (
                  <span className="text-error text-xs leading-5 font-normal">
                    요청할 팀원 정보를 불러오지 못했습니다.
                  </span>
                )}
                {evidenceErrorMessage && (
                  <span className="text-error text-xs leading-5 font-normal">
                    {evidenceErrorMessage}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs leading-5 font-normal text-gray-600">
                팀장이 추가 근거를 요청한 뒤 답변할 수 있어요.
              </span>
            )}
          </div>
        )}
      </div>
    </SectionBlock>
  );
};

export default IssueCard;
