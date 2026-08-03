import { useState } from "react";
import { ChevronRightIcon } from "@/shared/components/icons/ChevronRightIcon";

const RecentProjectList = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mt-5 px-3">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls="recent-project-list"
        onClick={() => setIsExpanded((previous) => !previous)}
        className="group mb-2 flex w-full cursor-pointer items-center gap-2 px-1 text-left"
      >
        <span className="text-xs leading-4 font-medium text-gray-700">
          최근 프로젝트
        </span>
        <ChevronRightIcon
          size={10}
          className={`shrink-0 transition-[opacity,transform] duration-200 ${
            isExpanded
              ? "rotate-90 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              : "opacity-100"
          }`}
        />
      </button>
      {isExpanded && (
        <ul
          id="recent-project-list"
          className="space-y-1"
        >
          <li className="flex h-8 w-full cursor-pointer items-center rounded px-2 py-0">
            <div className="hover:bg-main-50 flex h-8 w-full items-center gap-2 rounded transition-colors hover:text-slate-900">
              <span className="h-2 w-2 min-w-2 rounded-full bg-[#A9B3C3]" />
              <span className="truncate text-base font-normal text-gray-600">
                PM Day 발표 준비
              </span>
            </div>
          </li>
          <li className="flex h-8 w-full cursor-pointer items-center rounded px-2 py-0">
            <div className="hover:bg-main-50 flex h-8 w-full items-center gap-2 rounded transition-colors hover:text-slate-900">
              <span className="h-2 w-2 min-w-2 rounded-full bg-[#A9B3C3]" />
              <span className="truncate text-base font-normal text-gray-600">
                캡스톤 서비스 제안서
              </span>
            </div>
          </li>
          <li className="flex h-8 w-full cursor-pointer items-center rounded px-2 py-0">
            <div className="hover:bg-main-50 flex h-8 w-full items-center gap-2 rounded transition-colors hover:text-slate-900">
              <span className="h-2 w-2 min-w-2 rounded-full bg-[#A9B3C3]" />
              <span className="truncate text-base font-normal text-gray-600">
                대외활동 기획안
              </span>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

export default RecentProjectList;
