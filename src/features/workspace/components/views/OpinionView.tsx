import { useState } from "react";
import SectionBlock from "../blocks/SectionBlock";
import CollectedOpinions from "./opinion/CollectedOpinions";
import OpinionForm from "./opinion/OpinionForm";
import type { WorkspaceSection } from "../../constants/sections";

interface OpinionViewProps {
  section: WorkspaceSection;
}

const OpinionView = ({ section }: OpinionViewProps) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  return (
    <div
      aria-label={`${section.title} 의견 작성`}
      className="flex flex-col gap-6"
    >
      <SectionBlock>
        <p className="text-[14px] font-medium text-gray-900">
          Q. 어떤 상황에서 이 제안이 시작됐나요?
        </p>
        <p className="text-[13px] text-gray-600">
          다음 내용을 중심으로 작성해 주세요.
        </p>
        <ul className="flex flex-col gap-2 text-[13px] text-gray-700">
          <li>· 최근의 변화·요구</li>
          <li>· 왜 지금 필요한가</li>
        </ul>
      </SectionBlock>

      {hasSubmitted ? (
        <CollectedOpinions onEditOpinion={() => setHasSubmitted(false)} />
      ) : (
        <OpinionForm onSubmit={() => setHasSubmitted(true)} />
      )}
    </div>
  );
};

export default OpinionView;
