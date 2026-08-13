import { cn } from "../../../../shared/utils/cn";

export interface CompletedNavigationSection {
  orderNo: number;
  title: string;
}

interface CompletedLeftSidebarProps {
  sections: CompletedNavigationSection[];
  activeSectionNo?: number;
  onSelectSection: (sectionNo: number) => void;
}

const CompletedLeftSidebar = ({
  sections,
  activeSectionNo,
  onSelectSection,
}: CompletedLeftSidebarProps) => (
  <aside className="flex h-full w-[220px] shrink-0 flex-col overflow-y-auto border-r border-gray-400 bg-white px-2 py-4">
    <h2 className="px-3 pb-2 text-[13px] leading-4 font-normal text-gray-600">
      섹션
    </h2>
    <nav className="flex flex-col gap-0.5">
      {sections.map((section) => {
        const isActive = section.orderNo === activeSectionNo;

        return (
          <button
            key={section.orderNo}
            type="button"
            onClick={() => onSelectSection(section.orderNo)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-left transition-colors",
              isActive ? "bg-gray-200" : "hover:bg-gray-100",
            )}
          >
            <span className="w-3 shrink-0 text-xs leading-4 font-normal text-gray-600">
              {section.orderNo}
            </span>
            <span
              className={cn(
                "truncate text-xs leading-4 font-medium",
                isActive ? "text-gray-900" : "text-gray-700",
              )}
            >
              {section.title}
            </span>
          </button>
        );
      })}
    </nav>
  </aside>
);

export default CompletedLeftSidebar;
