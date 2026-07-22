import { Link } from "react-router-dom";
import {
  WORKSPACE_SECTION_DEFINITIONS,
  type WorkspaceSectionNo,
} from "../constants/sections";

interface WorkspaceSidebarProps {
  projectId: number;
  currentSectionNo: WorkspaceSectionNo;
}

const WorkspaceSidebar = ({
  projectId,
  currentSectionNo,
}: WorkspaceSidebarProps) => {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="px-2 text-xs font-medium text-slate-500">섹션</p>

      <ul className="mt-3 space-y-1">
        {WORKSPACE_SECTION_DEFINITIONS.map((section) => {
          const isActive = section.sectionNo === currentSectionNo;

          return (
            <li key={section.sectionNo}>
              <Link
                to={`/workspace/${projectId}/sections/${section.sectionNo}`}
                className={
                  isActive
                    ? "bg-main-50 text-main-700 block rounded-lg px-3 py-2 text-sm font-medium"
                    : "block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                }
              >
                {section.sectionNo}. {section.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default WorkspaceSidebar;
