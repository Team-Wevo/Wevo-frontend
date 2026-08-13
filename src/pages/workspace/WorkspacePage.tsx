import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import type { WorkspaceSectionLoaderData } from "../../app/router/loaders/workspaceLoaders";
import WorkspaceLayout from "../../app/layouts/WorkspaceLayout";
import type { DraftSaveStatus } from "../../features/workspace/components/layout/WorkspaceHeader";
import type { ProjectResultType } from "../../features/project/api/projectList";
import type { ProjectInfoItem } from "../../features/workspace/components/layout/WorkspaceRightSidebar";
import DraftView from "../../features/workspace/components/views/DraftView";
import DraftHistoryView from "../../features/workspace/components/views/DraftHistoryView";
import OpinionView from "../../features/workspace/components/views/OpinionView";
import ReviewView from "../../features/workspace/components/views/ReviewView";
import { getWorkspacePhase } from "../../features/workspace/utils/getWorkspacePhase";
import { getWorkspacePermissions } from "../../features/workspace/utils/getWorkspacePermissions";
import { toDocumentProgress } from "../../features/workspace/utils/toDocumentProgress";
import { useWorkspaceSections } from "../../features/workspace/hooks/useWorkspaceSections";
import {
  SECTION_PHASES,
  type SectionPhase,
} from "../../shared/types/documentType";

const RESULT_TYPE_LABEL: Record<ProjectResultType, string> = {
  PROPOSAL: "제안서",
  PRESENTATION: "발표 구성안",
};

const WorkspacePage = () => {
  const {
    projectId,
    sectionNo,
    sections,
    currentSection,
    projectDetail,
    opinions,
    myOpinion,
  } = useLoaderData() as WorkspaceSectionLoaderData;
  const sectionsQuery = useWorkspaceSections(projectId, sections);
  const syncedSections = sectionsQuery.data ?? sections;
  const syncedCurrentSection =
    syncedSections.find((section) => section.orderNo === sectionNo) ??
    currentSection;
  const sectionId = syncedCurrentSection.projectSectionId;
  const currentPhase = getWorkspacePhase(syncedCurrentSection.sectionStatus);
  const permissions = getWorkspacePermissions(projectDetail.myRole);
  const [saveStatus, setSaveStatus] = useState<DraftSaveStatus>("idle");
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPhaseByView: Record<string, SectionPhase> = {
    collecting: "의견 모으기",
    draft: "정리·초안",
  };
  const requestedPhase = requestedPhaseByView[searchParams.get("view") ?? ""];
  const currentPhaseIndex = SECTION_PHASES.indexOf(currentPhase);
  const requestedPhaseIndex = requestedPhase
    ? SECTION_PHASES.indexOf(requestedPhase)
    : -1;
  const selectedPhase =
    requestedPhase && requestedPhaseIndex <= currentPhaseIndex
      ? requestedPhase
      : currentPhase;

  const handlePhaseSelect = (phase: SectionPhase) => {
    if (SECTION_PHASES.indexOf(phase) > currentPhaseIndex) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);

    if (phase === currentPhase) {
      nextSearchParams.delete("view");
    } else {
      nextSearchParams.set(
        "view",
        phase === "의견 모으기" ? "collecting" : "draft",
      );
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  const projectInfo: ProjectInfoItem[] = [
    {
      label: "결과물 유형",
      value: RESULT_TYPE_LABEL[projectDetail.resultType],
    },
    { label: "전달 대상", value: projectDetail.audience },
    { label: "시작 아이디어", value: projectDetail.ideaText },
  ];

  return (
    <WorkspaceLayout
      title={projectDetail.title}
      projectId={String(projectId)}
      projectInfo={projectInfo}
      progress={toDocumentProgress(syncedSections)}
      workspaceSections={syncedSections}
      activeStepId={syncedCurrentSection.orderNo}
      saveStatus={
        currentPhase === "의견 모으기" && selectedPhase === currentPhase
          ? saveStatus
          : undefined
      }
      permissions={permissions}
      selectedPhase={selectedPhase}
      onPhaseSelect={handlePhaseSelect}
    >
      {selectedPhase === "의견 모으기" ? (
        <OpinionView
          key={syncedCurrentSection.projectSectionId}
          projectId={projectId}
          section={syncedCurrentSection}
          sectionId={sectionId}
          opinions={opinions}
          myOpinion={myOpinion}
          onSaveStatusChange={setSaveStatus}
          permissions={permissions}
          readOnly={selectedPhase !== currentPhase}
        />
      ) : selectedPhase === "정리·초안" ? (
        selectedPhase === currentPhase ? (
          <DraftView
            section={syncedCurrentSection}
            permissions={permissions}
          />
        ) : (
          <DraftHistoryView sectionId={sectionId} />
        )
      ) : (
        <ReviewView
          section={syncedCurrentSection}
          sectionId={sectionId}
          permissions={permissions}
          projectId={String(projectId)}
          nextSectionNo={
            syncedSections.find(
              (item) => item.orderNo === syncedCurrentSection.orderNo + 1,
            )?.orderNo ?? null
          }
        />
      )}
    </WorkspaceLayout>
  );
};

export default WorkspacePage;
