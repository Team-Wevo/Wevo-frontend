import { useEffect, useState, type ReactNode } from "react";
import { useQueries } from "@tanstack/react-query";
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
import MobileDrawer from "../../shared/components/MobileDrawer";
import type {
  DocumentProgress,
  SectionPhase,
} from "../../shared/types/documentType";
import type { WorkspacePermissions } from "../../features/workspace/utils/getWorkspacePermissions";
import {
  getSectionDraft,
  getSectionDraftErrorMessage,
} from "../../features/workspace/api/getSectionDraft";
import type {
  WorkspaceSection,
  WorkspaceSectionStatus,
} from "../../features/workspace/constants/sections";
import { SECTION_DRAFT_QUERY_KEY } from "../../features/workspace/hooks/useSectionDraft";
import {
  clearPendingWorkspaceOnboarding,
  hasPendingWorkspaceOnboarding,
} from "../../features/workspace/utils/workspaceOnboardingStorage";

const DRAFT_AVAILABLE_STATUSES: WorkspaceSectionStatus[] = [
  "DRAFTING",
  "REVIEWING",
  "CONFIRMED",
];

const canHaveDraft = (status: WorkspaceSectionStatus) =>
  DRAFT_AVAILABLE_STATUSES.includes(status);

interface WorkspaceLayoutProps {
  title: string;
  projectId: string;
  projectInfo: ProjectInfoItem[];
  progress: DocumentProgress;
  workspaceSections: WorkspaceSection[];
  activeStepId: number;
  saveStatus?: DraftSaveStatus;
  permissions: WorkspacePermissions;
  selectedPhase: SectionPhase;
  onPhaseSelect: (phase: SectionPhase) => void;
  children: ReactNode;
}

interface WorkspaceOnboardingGateProps {
  projectId: string;
}

const WorkspaceOnboardingGate = ({
  projectId,
}: WorkspaceOnboardingGateProps) => {
  const [isVisible, setIsVisible] = useState(() =>
    hasPendingWorkspaceOnboarding(projectId),
  );

  useEffect(() => {
    if (isVisible) {
      clearPendingWorkspaceOnboarding(projectId);
    }
  }, [isVisible, projectId]);

  return isVisible ? (
    <WorkspaceOnboarding onFinish={() => setIsVisible(false)} />
  ) : null;
};

const WorkspaceLayout = ({
  title,
  projectId,
  projectInfo,
  progress,
  workspaceSections,
  activeStepId,
  saveStatus,
  permissions,
  selectedPhase,
  onPhaseSelect,
  children,
}: WorkspaceLayoutProps) => {
  const navigate = useNavigate();
  const [isFlowPreviewOpen, setIsFlowPreviewOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const activeSection = progress[activeStepId - 1];

  // 섹션이 바뀌면 모바일 작업 흐름 드로어를 닫는다.
  // effect 대신 렌더 중 이전 값과 비교해 조정한다(React 권장 — 불필요한 재렌더 방지).
  const [navDrawerStep, setNavDrawerStep] = useState(activeStepId);
  if (activeStepId !== navDrawerStep) {
    setNavDrawerStep(activeStepId);
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  }
  const documentTypeLabel =
    projectInfo.find((item) => item.label === "결과물 유형")?.value ?? "제안서";
  const previewDraftQueries = useQueries({
    queries: workspaceSections.map((section) => ({
      queryKey: [SECTION_DRAFT_QUERY_KEY, section.projectSectionId],
      queryFn: () => getSectionDraft(section.projectSectionId),
      enabled: isFlowPreviewOpen && canHaveDraft(section.sectionStatus),
      retry: false,
    })),
  });
  const flowPreviewSections: FlowPreviewSection[] = workspaceSections.map(
    (section, index) => {
      const draftQuery = previewDraftQueries[index];
      const shouldLoadDraft = canHaveDraft(section.sectionStatus);
      const content = shouldLoadDraft
        ? draftQuery.data?.content.trim()
        : undefined;

      return {
        sectionNo: section.orderNo,
        title: section.title,
        content: content || null,
        isLoading:
          shouldLoadDraft &&
          draftQuery.isPending &&
          draftQuery.fetchStatus === "fetching",
        errorMessage:
          shouldLoadDraft && draftQuery.isError
            ? getSectionDraftErrorMessage(draftQuery.error)
            : null,
      };
    },
  );

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
        onOpenNav={() => setIsNavOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onPreviewAll={() => setIsFlowPreviewOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <WorkspaceLeftSidebar
            progress={progress}
            activeStepId={activeStepId}
            projectId={projectId}
            onConfirmFinal={() => navigate(`/completed/${projectId}`)}
          />
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-gray-100 px-4 py-5 md:px-12 md:py-8 [&>*]:shrink-0">
          <div
            data-onboarding-highlight="opinion-box"
            className="flex flex-col gap-6"
          >
            <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
              {activeStepId}. {activeSection?.section}
            </h1>
            <WorkspacePhaseStepper
              currentStatus={activeSection?.status ?? "시작 전"}
              selectedPhase={selectedPhase}
              onPhaseSelect={onPhaseSelect}
            />
            {children}
          </div>
        </div>

        <div className="hidden md:flex">
          <WorkspaceRightSidebar projectInfo={projectInfo} />
        </div>
      </div>

      <MobileDrawer
        open={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        side="left"
        label="작업 흐름"
      >
        <WorkspaceLeftSidebar
          progress={progress}
          activeStepId={activeStepId}
          projectId={projectId}
          onConfirmFinal={() => {
            setIsNavOpen(false);
            navigate(`/completed/${projectId}`);
          }}
        />
      </MobileDrawer>

      <MobileDrawer
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        side="right"
        label="프로젝트 정보"
      >
        <WorkspaceRightSidebar projectInfo={projectInfo} />
      </MobileDrawer>

      <WorkspaceOnboardingGate
        key={projectId}
        projectId={projectId}
      />

      {isFlowPreviewOpen && (
        <FlowPreviewModal
          documentTitle={title}
          documentTypeLabel={documentTypeLabel}
          sections={flowPreviewSections}
          onNavigateToSection={handleNavigateToSection}
          onClose={() => setIsFlowPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default WorkspaceLayout;
