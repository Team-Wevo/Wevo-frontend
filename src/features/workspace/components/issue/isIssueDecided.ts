import type {
  IssueCustomInputMap,
  IssueDecisionMap,
  WorkspaceIssue,
} from "./types";

/**
 * 쟁점이 결정된 상태인지 판단한다.
 * - 근거 요청형은 요청을 보낸 뒤에는 답변을 기다리며 진행할 수 있다.
 * - "직접 입력"을 고른 경우에는 내용을 채워야 결정으로 인정한다.
 */
export const isIssueDecided = (
  issue: WorkspaceIssue,
  decisions: IssueDecisionMap,
  customInputs: IssueCustomInputMap,
) => {
  if (issue.resolutionType !== "choice") {
    return issue.evidenceRequest?.requested ?? false;
  }

  const selectedOptionId = decisions[issue.id];

  if (!selectedOptionId) {
    return false;
  }

  const selectedOption = issue.options?.find(
    (option) => option.id === selectedOptionId,
  );

  if (!selectedOption?.isCustomInput) {
    return true;
  }

  return (customInputs[issue.id] ?? "").trim().length > 0;
};
