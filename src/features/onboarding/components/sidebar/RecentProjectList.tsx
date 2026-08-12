import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@/shared/components/icons/ChevronRightIcon";
import {
  getMyProjects,
  type ProjectSummaryResponse,
} from "@/features/project/api/projectList";

const MAX_RECENT_PROJECT_COUNT = 5;

interface RecentProjectListProps {
  isLoggedIn?: boolean;
}

const RecentProjectList = ({ isLoggedIn = false }: RecentProjectListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [projects, setProjects] = useState<ProjectSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(isLoggedIn);

  useEffect(() => {
    // 비로그인 상태에서 호출하면 401 인터셉터가 홈으로 강제 이동시키므로 요청하지 않는다.
    if (!isLoggedIn) return;

    let isCancelled = false;

    getMyProjects()
      .then((response) => {
        if (isCancelled) return;
        setProjects(response.slice(0, MAX_RECENT_PROJECT_COUNT));
      })
      .catch(() => {
        // 사이드바 보조 위젯이라 실패해도 조용히 빈 목록으로 둔다.
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isLoggedIn]);

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
      {isExpanded && isLoggedIn && !isLoading && projects.length === 0 && (
        <p
          id="recent-project-list"
          className="px-2 text-xs leading-4.5 font-normal text-gray-600"
        >
          최근 작업한 프로젝트가 여기에 모여요.
        </p>
      )}
      {isExpanded && isLoggedIn && projects.length > 0 && (
        <ul
          id="recent-project-list"
          className="space-y-1"
        >
          {projects.map((project) => (
            <li
              key={project.projectId}
              className="flex h-8 w-full cursor-pointer items-center rounded px-2 py-0"
            >
              <Link
                to={`/workspace/${project.projectId}/sections/1`}
                className="hover:bg-main-50 flex h-8 w-full items-center gap-2 rounded transition-colors hover:text-slate-900"
              >
                <span className="h-2 w-2 min-w-2 rounded-full bg-[#A9B3C3]" />
                <span className="truncate text-base font-normal text-gray-600">
                  {project.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentProjectList;
