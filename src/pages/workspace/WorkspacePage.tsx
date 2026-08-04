import { useLoaderData } from "react-router-dom";
import type { WorkspaceSectionLoaderData } from "../../app/router/loaders/workspaceLoaders";
import WorkspaceLayout from "../../app/layouts/WorkspaceLayout";
import type { ProjectResultType } from "../../features/project/api/projectList";
import type { ProjectInfoItem } from "../../features/workspace/components/layout/WorkspaceRightSidebar";
import DraftView from "../../features/workspace/components/views/DraftView";
import OpinionView from "../../features/workspace/components/views/OpinionView";
import ReviewView from "../../features/workspace/components/views/ReviewView";
import { getWorkspacePhase } from "../../features/workspace/utils/getWorkspacePhase";
import { toDocumentProgress } from "../../features/workspace/utils/toDocumentProgress";

const RESULT_TYPE_LABEL: Record<ProjectResultType, string> = {
  PROPOSAL: "제안서",
  PRESENTATION: "발표 구성안",
};

const WorkspacePage = () => {
  const { projectId, sections, currentSection, projectDetail } =
    useLoaderData() as WorkspaceSectionLoaderData;
  const currentPhase = getWorkspacePhase(currentSection.sectionStatus);

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
