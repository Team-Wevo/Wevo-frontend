import { useState } from "react";
import { useRevalidator } from "react-router-dom";
import SectionBlock from "../blocks/SectionBlock";
import CollectedOpinions from "./opinion/CollectedOpinions";
import OpinionForm from "./opinion/OpinionForm";
import type { WorkspaceSection } from "../../constants/sections";
import type { SectionOpinionsResponse } from "../../api/getSectionOpinions";
import type { MyOpinionResponse } from "../../api/getMyOpinion";
import type { DraftSaveStatus } from "../layout/WorkspaceHeader";

interface OpinionViewProps {
  section: WorkspaceSection;
  opinions: SectionOpinionsResponse | null;
  myOpinion: MyOpinionResponse | null;
  onSaveStatusChange?: (status: DraftSaveStatus) => void;
}

const OpinionView = ({
  section,
  opinions,
  myOpinion,
  onSaveStatusChange,
}: OpinionViewProps) => {
  const revalidator = useRevalidator();
  const [isEditingOwnOpinion, setIsEditingOwnOpinion] = useState(false);

  const handleOpinionSubmitted = () => {
    setIsEditingOwnOpinion(false);
    // 제출 성공 시 loader를 다시 실행해 최신 의견 목록을 반영한다.
    revalidator.revalidate();
  };

  const showForm = !opinions?.everSubmitted || isEditingOwnOpinion;

  // keyQuestion은 "? "로 이어붙은 여러 질문이 한 문자열로 내려온다.
  // 첫 질문만 대표 질문으로 강조하고 나머지는 하위 bullet로 보여준다.
  const questionSentences = section.keyQuestion
    .split("? ")
    .map((sentence, index, sentences) =>
      index < sentences.length - 1 ? `${sentence}?` : sentence,
    );
  const [mainQuestion, ...subQuestions] = questionSentences;

  return (
    <div
      aria-label={`${section.title} 의견 작성`}
      className="flex flex-col gap-6"
    >
      <SectionBlock className="flex flex-col gap-2">
        <p className="text-[14px] font-medium text-gray-900">
          Q. {mainQuestion}
        </p>
        {subQuestions.length > 0 && (
          <>
            <p className="text-[13px] text-gray-600">
              다음 내용을 중심으로 작성해주세요.
            </p>
            <ul className="flex flex-col gap-2 text-[13px] text-gray-700">
              {subQuestions.map((question) => (
                <li key={question}>· {question}</li>
              ))}
            </ul>
          </>
        )}
        {section.guide && (
          <p className="text-main-700 text-[13px]">· {section.guide}</p>
        )}
      </SectionBlock>

      {showForm ? (
        <OpinionForm
          projectSectionId={section.projectSectionId}
          initialContent={myOpinion?.exists ? myOpinion.content : ""}
          onSubmit={handleOpinionSubmitted}
          onSaveStatusChange={onSaveStatusChange}
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
