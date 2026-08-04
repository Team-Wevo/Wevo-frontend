import { useState, type ReactNode } from "react";
import WorkspaceHeader, {
  type Collaborator,
} from "../../features/workspace/components/layout/WorkspaceHeader";
import WorkspaceLeftSidebar from "../../features/workspace/components/layout/WorkspaceLeftSidebar";
import WorkspaceOnboarding from "../../features/workspace/components/onboarding/WorkspaceOnboarding";
import WorkspacePhaseStepper from "../../features/workspace/components/layout/WorkspacePhaseStepper";
import WorkspaceRightSidebar, {
  type ProjectInfoItem,
} from "../../features/workspace/components/layout/WorkspaceRightSidebar";
import type { DocumentProgress } from "../../shared/types/documentType";

// TODO: 협업자/프로젝트 부가 정보 API 연동 전까지 사용하는 기본값
const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: "1", color: "bg-complete", name: "구다연" },
  { id: "2", color: "bg-success", name: "신연우" },
  { id: "3", color: "bg-warning", name: "장현빈" },
  { id: "4", color: "bg-main", name: "유금진" },
];

const DEFAULT_PROJECT_INFO: ProjectInfoItem[] = [
  { label: "결과물 유형", value: "제안서" },
  { label: "전달 대상", value: "팀원" },
  { label: "시작 아이디어", value: "장학금 매칭 서비스" },
];

interface WorkspaceLayoutProps {
  title: string;
  projectId: string;
  progress: DocumentProgress;
  activeStepId: number;
  children: ReactNode;
}

const WorkspaceLayout = ({
  title,
  projectId,
  progress,
  activeStepId,
  children,
}: WorkspaceLayoutProps) => {
  const activeSection = progress[activeStepId - 1];
  // TODO: 로그인/API 연동 후 "다시 보지 않기" 서버 저장으로 교체. 지금은 매번 노출.
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <WorkspaceHeader
        title={title}
        isSaved={true}
        collaborators={DEFAULT_COLLABORATORS}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceLeftSidebar
          progress={progress}
          activeStepId={activeStepId}
          projectId={projectId}
        />

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-gray-100 px-12 py-8 [&>*]:shrink-0">
          <div
            data-onboarding-highlight="opinion-box"
            className="flex flex-col gap-6"
          >
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeStepId}. {activeSection?.section}
            </h1>
            <WorkspacePhaseStepper
              currentStatus={activeSection?.status ?? "시작 전"}
            />
            {children}
          </div>
        </div>

        <WorkspaceRightSidebar projectInfo={DEFAULT_PROJECT_INFO} />
      </div>

      {showOnboarding && (
        <WorkspaceOnboarding onFinish={() => setShowOnboarding(false)} />
      )}
    </div>
  );
};

export default WorkspaceLayout;
