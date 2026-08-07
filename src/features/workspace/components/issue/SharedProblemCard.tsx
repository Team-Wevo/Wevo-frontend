import SectionBlock from "../blocks/SectionBlock";
import type { SharedProblem } from "./types";

interface SharedProblemCardProps {
  sharedProblem: SharedProblem;
}

const SharedProblemCard = ({ sharedProblem }: SharedProblemCardProps) => {
  return (
    <SectionBlock>
      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] leading-5 font-medium text-green-700">
          공통으로 본 문제
        </h2>

        <p className="text-[13px] leading-[22px] font-normal text-gray-900">
          {sharedProblem.summary}
        </p>

        <p className="text-[13px] leading-[22px] font-normal text-gray-900">
          {sharedProblem.issueStatement}
        </p>
      </div>
    </SectionBlock>
  );
};

export default SharedProblemCard;
