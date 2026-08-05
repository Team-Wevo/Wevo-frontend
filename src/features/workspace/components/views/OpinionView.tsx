import { useState } from "react";
import { useRevalidator } from "react-router-dom";
import SectionBlock from "../blocks/SectionBlock";
import CollectedOpinions from "./opinion/CollectedOpinions";
import OpinionForm from "./opinion/OpinionForm";
import type { WorkspaceSection } from "../../constants/sections";
import type { SectionOpinionsResponse } from "../../api/getSectionOpinions";

interface OpinionViewProps {
  section: WorkspaceSection;
  opinions: SectionOpinionsResponse | null;
}

const OpinionView = ({ section, opinions }: OpinionViewProps) => {
  const revalidator = useRevalidator();
  const [isEditingOwnOpinion, setIsEditingOwnOpinion] = useState(false);

  const handleOpinionSubmitted = () => {
    setIsEditingOwnOpinion(false);
    // 제출 성공 시 loader를 다시 실행해 최신 의견 목록을 반영한다.
    revalidator.revalidate();
  };

  const showForm = !opinions?.everSubmitted || isEditingOwnOpinion;

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

      {showForm ? (
        <OpinionForm
          projectSectionId={section.projectSectionId}
          onSubmit={handleOpinionSubmitted}
        />
      ) : (
        <CollectedOpinions
          projectSectionId={section.projectSectionId}
          opinions={opinions?.opinions ?? []}
          totalSubmittedCount={opinions?.totalSubmittedCount ?? 0}
          onEditOpinion={() => setIsEditingOwnOpinion(true)}
        />
      )}
    </div>
  );
};

export default OpinionView;
