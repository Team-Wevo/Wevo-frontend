import { useLoaderData } from "react-router-dom";
import type { WorkspaceSectionLoaderData } from "../../app/router/loaders/workspaceLoaders";
import { getWorkspacePhase } from "../../features/workspace/utils/getWorkspacePhase";
import WorkspaceHeader from "../../features/workspace/components/WorkspaceHeader";
import WorkspaceRenderer from "../../features/workspace/components/WorkspaceRenderer";
import WorkspaceSidebar from "../../features/workspace/components/WorkspaceSidebar";

const WorkspacePage = () => {
  const { projectId, sectionNo, sections, currentSection } =
    useLoaderData() as WorkspaceSectionLoaderData;
  const currentPhase = getWorkspacePhase(currentSection.sectionStatus);

  return (
    <div className="p-6 md:p-10">
      <WorkspaceHeader
        projectId={projectId}
        sectionNo={currentSection.orderNo}
        currentSection={currentSection}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <WorkspaceSidebar
          projectId={projectId}
          currentSectionNo={currentSection.orderNo}
        />

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            <p>URL sectionNo: {sectionNo}</p>
            <p>현재 sectionStatus: {currentSection.sectionStatus}</p>
            <p>현재 phase: {currentPhase}</p>
            <p>섹션 수: {sections.length}</p>
          </div>

          <WorkspaceRenderer
            phase={currentPhase}
            section={currentSection}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
