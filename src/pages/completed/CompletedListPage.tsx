import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ListLayout from "../../app/layouts/ListLayout";
import { useMainLayoutContext } from "../../app/layouts/mainLayoutContext";
import {
  getCompletedProjects,
  type ProjectResultType,
} from "../../features/project/api/projectList";
import { GuestPreview } from "../../shared/components/GuestPreview";
import {
  ProjectCard,
  type ProjectCategory,
} from "../../shared/components/ProjectCard";

const GUEST_PREVIEW_BY_FILTER: Record<
  string,
  { title: string; descriptions: string[] }
> = {
  전체: {
    title: "완성한 문서를 보관하는 곳이에요",
    descriptions: [
      "작업을 마친 제안서와 발표 구성안이 이곳에 쌓입니다.",
      "완성한 문서를 언제든 다시 열어보고 내보낼 수 있어요.",
    ],
  },
  제안서: {
    title: "완성한 제안서를 모아 보는 곳이에요",
    descriptions: [
      "지원사업이나 후원 요청처럼 상대를 설득해야 하는 문서를 완성하면 이곳에 정리됩니다.",
    ],
  },
  "발표 구성안": {
    title: "완성한 발표 구성안을 모아 보는 곳이에요",
    descriptions: [
      "발표 흐름과 슬라이드 구성을 정리한 문서를 완성하면 이곳에 정리됩니다.",
    ],
  },
};

const RESULT_TYPE_TO_CATEGORY: Record<ProjectResultType, ProjectCategory> = {
  PROPOSAL: "제안서",
  PRESENTATION: "발표 구성안",
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join(".");
};

export const CompletedListPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal } = useMainLayoutContext();
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const completedProjectsQuery = useQuery({
    queryKey: ["my-projects", "completed"],
    queryFn: getCompletedProjects,
    enabled: isLoggedIn,
    staleTime: 30_000,
  });
  const completedProjects = completedProjectsQuery.data ?? [];
  const filters = [
    { label: "전체", count: completedProjects.length },
    {
      label: "제안서",
      count: completedProjects.filter(
        (project) => project.resultType === "PROPOSAL",
      ).length,
    },
    {
      label: "발표 구성안",
      count: completedProjects.filter(
        (project) => project.resultType === "PRESENTATION",
      ).length,
    },
  ];
  const activeFilter = filters[activeFilterIndex].label;
  const guestPreview = GUEST_PREVIEW_BY_FILTER[activeFilter];
  const filteredProjects =
    activeFilter === "전체"
      ? completedProjects
      : completedProjects.filter(
          (project) =>
            RESULT_TYPE_TO_CATEGORY[project.resultType] === activeFilter,
        );

  return (
    <ListLayout
      title="완성본"
      filters={filters}
      activeFilterIndex={activeFilterIndex}
      onFilterChange={setActiveFilterIndex}
      showFilterCounts={isLoggedIn}
    >
      {!isLoggedIn && (
        <GuestPreview
          title={guestPreview.title}
          descriptions={guestPreview.descriptions}
          onAction={openLoginModal}
        />
      )}
      {isLoggedIn && completedProjectsQuery.isPending && (
        <p className="col-span-full text-sm text-gray-600">
          완성본 목록을 불러오는 중이에요...
        </p>
      )}
      {isLoggedIn && completedProjectsQuery.isError && (
        <p className="text-error col-span-full text-sm">
          완성본 목록을 불러오지 못했습니다.
        </p>
      )}
      {isLoggedIn &&
        completedProjectsQuery.isSuccess &&
        filteredProjects.map((project) => (
          <ProjectCard
            key={project.projectId}
            category={RESULT_TYPE_TO_CATEGORY[project.resultType]}
            title={project.title}
            date={formatDate(project.createdAt)}
            dateLabel="생성"
            showEditIcon={false}
            onOpen={() => navigate(`/completed/${project.projectId}`)}
          />
        ))}
      {isLoggedIn &&
        completedProjectsQuery.isSuccess &&
        filteredProjects.length === 0 && (
          <p className="col-span-full text-sm text-gray-600">
            해당하는 완성본이 아직 없어요.
          </p>
        )}
    </ListLayout>
  );
};

export default CompletedListPage;
