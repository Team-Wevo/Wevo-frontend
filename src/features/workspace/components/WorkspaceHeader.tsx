import type {
  WorkspaceSection,
  WorkspaceSectionNo,
} from "../constants/sections";

interface WorkspaceHeaderProps {
  projectId: number;
  sectionNo: WorkspaceSectionNo;
  currentSection: WorkspaceSection;
}

const WorkspaceHeader = ({
  projectId,
  sectionNo,
  currentSection,
}: WorkspaceHeaderProps) => {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-slate-500">Workspace</p>
      <h1 className="mt-1 text-xl font-semibold text-slate-900">
        {sectionNo}. {currentSection.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        프로젝트 ID {projectId} · Section No {sectionNo}
      </p>
    </header>
  );
};

export default WorkspaceHeader;
