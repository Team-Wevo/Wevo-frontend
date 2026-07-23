import { useLoaderData } from "react-router-dom";
import type { WorkspaceSectionLoaderData } from "../../app/router/loaders/workspaceLoaders";
import WorkspaceLayout from "../../app/layouts/WorkspaceLayout";
import DraftView from "../../features/workspace/components/views/DraftView";
import OpinionView from "../../features/workspace/components/views/OpinionView";
import ReviewView from "../../features/workspace/components/views/ReviewView";
import { getWorkspacePhase } from "../../features/workspace/utils/getWorkspacePhase";
import { toDocumentProgress } from "../../features/workspace/utils/toDocumentProgress";

const WorkspacePage = () => {
  const { projectId, sections, currentSection } =
    useLoaderData() as WorkspaceSectionLoaderData;
  const currentPhase = getWorkspacePhase(currentSection.sectionStatus);

  return (
    <WorkspaceLayout
      // TODO: 프로젝트 상세 API 연동 후 실제 프로젝트 제목으로 교체
      title={`프로젝트 ${projectId}`}
      projectId={String(projectId)}
      progress={toDocumentProgress(sections)}
      activeStepId={currentSection.orderNo}
    >
      {currentPhase === "의견 모으기" ? (
        <OpinionView section={currentSection} />
      ) : currentPhase === "정리·초안" ? (
        <DraftView section={currentSection} />
      ) : (
        <ReviewView section={currentSection} />
      )}
    </WorkspaceLayout>
  );
};

export default WorkspacePage;
