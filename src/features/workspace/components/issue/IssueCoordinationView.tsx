import { useMemo, useState } from "react";
import { Sparkle } from "lucide-react";
import IssueCard from "./IssueCard";
import SharedProblemCard from "./SharedProblemCard";
import { isIssueDecided } from "./isIssueDecided";
import { Button } from "../../../../shared/components/Button";
import type {
  IssueCoordinationData,
  IssueCustomInputMap,
  IssueDecisionMap,
} from "./types";

interface IssueCoordinationViewProps {
  data: IssueCoordinationData;
  /** 모든 쟁점을 결정한 뒤 초안 생성 단계로 넘어간다. */
  onCreateDraft: () => void;
}

const IssueCoordinationView = ({
  data,
  onCreateDraft,
}: IssueCoordinationViewProps) => {
  const [decisions, setDecisions] = useState<IssueDecisionMap>({});
  const [customInputs, setCustomInputs] = useState<IssueCustomInputMap>({});

  const handleSelectOption = (issueId: string, optionId: string) => {
    setDecisions((previous) => ({ ...previous, [issueId]: optionId }));
  };

  const handleChangeCustomInput = (issueId: string, value: string) => {
    setCustomInputs((previous) => ({ ...previous, [issueId]: value }));
  };

  const canCreateDraft = useMemo(
    () =>
      data.issues.every((issue) =>
        isIssueDecided(issue, decisions, customInputs),
      ),
    [data.issues, decisions, customInputs],
  );

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
          />
        ))}
      </div>

      <div className="flex flex-col items-end gap-3">
        <p className="text-xs leading-[18px] font-normal text-gray-600">
          쟁점을 모두 결정하면 초안을 만들 수 있어요. (근거 부족 항목은 답변을
          기다리며 진행 가능)
        </p>

        <Button
          type="main"
          onClick={onCreateDraft}
          disabled={!canCreateDraft}
          className="h-auto rounded-sm px-5 py-3 text-[13px] leading-5 font-medium disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100"
        >
          <Sparkle className="size-4 shrink-0" />
          <span>결정 반영해 초안 만들기</span>
        </Button>
      </div>
    </div>
  );
};

export default IssueCoordinationView;
