import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import WorkspaceHeader, {
  type DraftSaveStatus,
} from "../../features/workspace/components/layout/WorkspaceHeader";
import FlowPreviewModal, {
  type FlowPreviewSection,
} from "../../features/workspace/components/layout/FlowPreviewModal";
import WorkspaceLeftSidebar from "../../features/workspace/components/layout/WorkspaceLeftSidebar";
import WorkspaceOnboarding from "../../features/workspace/components/onboarding/WorkspaceOnboarding";
import WorkspacePhaseStepper from "../../features/workspace/components/layout/WorkspacePhaseStepper";
import WorkspaceRightSidebar, {
  type ProjectInfoItem,
} from "../../features/workspace/components/layout/WorkspaceRightSidebar";
import type { DocumentProgress } from "../../shared/types/documentType";
import type { WorkspacePermissions } from "../../features/workspace/utils/getWorkspacePermissions";

// TODO: 섹션별 초안 내용 API 연동 후 실제 본문으로 교체
const MOCK_WRITTEN_SECTION_CONTENT =
  "최근 대학생의 장학금 수요가 늘고 있으나, 관련 정보는 학교 홈페이지·장학재단·학과 공지 등 여러 곳에 흩어져 있다. 학생은 자신에게 맞는 장학금을 찾기 위해 여러 사이트를 오가며 반복적으로 탐색·비교해야 하고, 이 과정에서 적합한 공고를 놓치거나 마감을 지나치는 경우가 많다.";

const buildFlowPreviewSections = (
  progress: DocumentProgress,
): FlowPreviewSection[] => {
  return progress.map((item, index) => ({
    sectionNo: index + 1,
    title: item.section,
    content: item.status === "작성 완료" ? MOCK_WRITTEN_SECTION_CONTENT : null,
  }));
};

interface WorkspaceLayoutProps {
  title: string;
  projectId: string;
  projectInfo: ProjectInfoItem[];
  progress: DocumentProgress;
  activeStepId: number;
  saveStatus?: DraftSaveStatus;
  permissions: WorkspacePermissions;
  children: ReactNode;
}

const WorkspaceLayout = ({
  title,
  projectId,
  projectInfo,
  progress,
  activeStepId,
  saveStatus,
  permissions,
  children,
}: WorkspaceLayoutProps) => {
  const navigate = useNavigate();
  const [isFlowPreviewOpen, setIsFlowPreviewOpen] = useState(false);
  const activeSection = progress[activeStepId - 1];
  // TODO: 로그인/API 연동 후 "다시 보지 않기" 서버 저장으로 교체. 지금은 매번 노출.
  const [showOnboarding, setShowOnboarding] = useState(true);
  const documentTypeLabel =
    projectInfo.find((item) => item.label === "결과물 유형")?.value ?? "제안서";

  const handleNavigateToSection = (sectionNo: number) => {
    setIsFlowPreviewOpen(false);
    navigate(`/workspace/${projectId}/sections/${sectionNo}`, {
      replace: true,
    });
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <WorkspaceHeader
        title={title}
        projectId={projectId}
        saveStatus={saveStatus}
        canInviteMembers={permissions.canInviteMembers}
        onPreviewAll={() => setIsFlowPreviewOpen(true)}
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

        <WorkspaceRightSidebar projectInfo={projectInfo} />
      </div>

      {showOnboarding && (
        <WorkspaceOnboarding onFinish={() => setShowOnboarding(false)} />
      )}

      {isFlowPreviewOpen && (
        <FlowPreviewModal
          documentTitle={title}
          documentTypeLabel={documentTypeLabel}
          sections={buildFlowPreviewSections(progress)}
          onNavigateToSection={handleNavigateToSection}
          onClose={() => setIsFlowPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default WorkspaceLayout;
