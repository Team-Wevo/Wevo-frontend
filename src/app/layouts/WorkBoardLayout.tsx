import { useState } from "react";
import { Outlet } from "react-router-dom";
import WorkBoardHeader, {
  type Collaborator,
} from "../../features/board/components/WorkBoardHeader";
import WorkBoardLeftSidebar from "../../features/board/components/WorkBoardLeftSidebar";
import WorkBoardPhaseStepper from "../../features/board/components/WorkBoardPhaseStepper";
import WorkBoardRightSidebar, {
  type ProjectInfoItem,
} from "../../features/board/components/WorkBoardRightSidebar";
import {
  PROPOSAL_SECTIONS,
  type DocumentProgress,
} from "../../shared/types/documentType";

// TODO: 라우트 연결 시 실제 projectId로 교체
const DUMMY_PROJECT_ID = "demo-project";

const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: "1", color: "bg-complete", name: "구다연" },
  { id: "2", color: "bg-success", name: "신연우" },
  { id: "3", color: "bg-warning", name: "장현빈" },
  { id: "4", color: "bg-main", name: "유금진" },
];

// 여러 상태를 한 번에 확인해볼 수 있도록 섹션마다 다른 status를 채워둔 테스트용 기본값
const DEFAULT_PROGRESS: DocumentProgress = [
  { section: PROPOSAL_SECTIONS[0], status: "작성 완료" },
  { section: PROPOSAL_SECTIONS[1], status: "의견 모으기" },
  { section: PROPOSAL_SECTIONS[2], status: "정리·초안" },
  { section: PROPOSAL_SECTIONS[3], status: "검토·확정" },
  { section: PROPOSAL_SECTIONS[4], status: "시작 전" },
  { section: PROPOSAL_SECTIONS[5], status: "작성 완료" },
];

const DEFAULT_PROJECT_INFO: ProjectInfoItem[] = [
  { label: "결과물 유형", value: "제안서" },
  { label: "전달 대상", value: "팀원" },
  { label: "시작 아이디어", value: "장학금 매칭 서비스" },
];

const title = "장학금 매칭 서비스 제안서";
const collaborators = DEFAULT_COLLABORATORS;
const onInvite = () => {};
const onPreviewAll = () => {};

const WorkBoardLayout = () => {
  const [isSaved] = useState(true);
  const [activeStepId, setActiveStepId] = useState(2);
  const [progress] = useState<DocumentProgress>(DEFAULT_PROGRESS);
  const activeSection = progress[activeStepId - 1];

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <WorkBoardHeader
        title={title}
        isSaved={isSaved}
        collaborators={collaborators}
        onInvite={onInvite}
        onPreviewAll={onPreviewAll}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkBoardLeftSidebar
          progress={progress}
          activeStepId={activeStepId}
          projectId={DUMMY_PROJECT_ID}
          onStepSelect={setActiveStepId}
        />

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-gray-100 px-12 py-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {activeStepId}. {activeSection?.section}{" "}
            {/*여기 나중에 useParam 적용하여 수정 예정*/}
          </h1>
          <WorkBoardPhaseStepper
            currentStatus={activeSection?.status ?? "시작 전"}
          />
          <Outlet />
        </div>

        <WorkBoardRightSidebar projectInfo={DEFAULT_PROJECT_INFO} />
      </div>
    </div>
  );
};

export default WorkBoardLayout;
