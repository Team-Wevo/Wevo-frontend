import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@/shared/components/icons/ChevronRightIcon";
import { getMyProjects } from "@/features/project/api/projectList";

const RECENT_PROJECT_COUNT = 3;

interface RecentProjectListProps {
  isLoggedIn?: boolean;
}

const RecentProjectList = ({ isLoggedIn = false }: RecentProjectListProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const projectsQuery = useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjects,
    enabled: isLoggedIn,
    staleTime: 30_000,
  });
  const recentProjects =
    projectsQuery.data?.slice(0, RECENT_PROJECT_COUNT) ?? [];

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
      {isExpanded && !isLoggedIn && (
        <p
          id="recent-project-list"
          className="px-2 text-xs leading-4.5 font-normal text-gray-600"
        >
          최근 작업한 프로젝트가 여기에 모여요.
        </p>
      )}
      {isExpanded && isLoggedIn && (
        <div id="recent-project-list">
          {projectsQuery.isPending ? (
            <p className="px-2 text-xs leading-4.5 font-normal text-gray-600">
              프로젝트를 불러오는 중이에요.
            </p>
          ) : projectsQuery.isError ? (
            <p className="text-error px-2 text-xs leading-4.5 font-normal">
              최근 프로젝트를 불러오지 못했어요.
            </p>
          ) : recentProjects.length === 0 ? (
            <p className="px-2 text-xs leading-4.5 font-normal text-gray-600">
              최근 작업한 프로젝트가 없어요.
            </p>
          ) : (
            <ul className="space-y-1">
              {recentProjects.map((project) => (
                <li key={project.projectId}>
                  <button
                    type="button"
                    title={project.title}
                    onClick={() =>
                      navigate(
                        `/workspace/${project.projectId}/sections/${project.lastActiveSection.order}`,
                      )
                    }
                    className="hover:bg-main-50 flex h-8 w-full cursor-pointer items-center gap-2 rounded px-2 text-left transition-colors hover:text-slate-900"
                  >
                    <span className="size-2 shrink-0 rounded-full bg-[#A9B3C3]" />
                    <span className="truncate text-base font-normal text-gray-600">
                      {project.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentProjectList;
