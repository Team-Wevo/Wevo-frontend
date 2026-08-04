import type { ReactNode } from "react";
import WorkspaceHeader, {
  type Collaborator,
} from "../../features/workspace/components/layout/WorkspaceHeader";
import WorkspaceLeftSidebar from "../../features/workspace/components/layout/WorkspaceLeftSidebar";
import WorkspacePhaseStepper from "../../features/workspace/components/layout/WorkspacePhaseStepper";
import WorkspaceRightSidebar, {
  type ProjectInfoItem,
} from "../../features/workspace/components/layout/WorkspaceRightSidebar";
import type { DocumentProgress } from "../../shared/types/documentType";

// TODO: 협업자 API 연동 전까지 사용하는 기본값 (상세 API는 memberCount만 주고 개별 멤버 정보는 안 줌)
const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: "1", color: "bg-complete", name: "구다연" },
  { id: "2", color: "bg-success", name: "신연우" },
  { id: "3", color: "bg-warning", name: "장현빈" },
  { id: "4", color: "bg-main", name: "유금진" },
];

interface WorkspaceLayoutProps {
  title: string;
  projectId: string;
  projectInfo: ProjectInfoItem[];
  progress: DocumentProgress;
  activeStepId: number;
  children: ReactNode;
}

const WorkspaceLayout = ({
  title,
  projectId,
  projectInfo,
  progress,
  activeStepId,
  children,
}: WorkspaceLayoutProps) => {
  const activeSection = progress[activeStepId - 1];

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

        <div className="flex flex-1 flex-col bg-gray-100 px-12 py-8">
          <div
            className="min-h-0 flex-1 overflow-y-auto"
            data-workspace-scroll-container="true"
          >
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                {activeStepId}. {activeSection?.section}
              </h1>
              <WorkspacePhaseStepper
                currentStatus={activeSection?.status ?? "시작 전"}
              />
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </div>

        <WorkspaceRightSidebar projectInfo={projectInfo} />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
