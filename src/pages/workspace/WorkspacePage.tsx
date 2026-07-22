import { useLoaderData, useParams } from "react-router-dom";
import type { WorkspaceSectionLoaderData } from "../../app/router/loaders/workspaceLoaders";
import { getWorkspacePhase } from "../../features/workspace/utils/getWorkspacePhase";

const WorkspacePage = () => {
  const { projectId, sectionNo, sections, currentSection } =
    useLoaderData() as WorkspaceSectionLoaderData;
  const params = useParams();
  const currentPhase = getWorkspacePhase(currentSection.sectionStatus);

  return (
    <div className="p-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">WorkspacePage</h1>

        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>projectId: {projectId}</p>
          <p>sectionNo(url): {params.sectionNo ?? sectionNo}</p>
          <p>currentSection.orderNo: {currentSection.orderNo}</p>
          <p>
            currentSection.projectSectionId: {currentSection.projectSectionId}
          </p>
          <p>currentSection.sectionStatus: {currentSection.sectionStatus}</p>
          <p>currentPhase: {currentPhase}</p>
          <p>sections count: {sections.length}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
