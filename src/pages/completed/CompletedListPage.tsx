import { useState } from "react";
import ListLayout from "../../app/layouts/ListLayout";
import { useMainLayoutContext } from "../../app/layouts/mainLayoutContext";
import { GuestPreview } from "../../shared/components/GuestPreview";
import { ProjectCard } from "../../shared/components/ProjectCard";

const GUEST_PREVIEW_BY_FILTER: Record<
  string,
  { title: string; description: string }
> = {
  전체: {
    title: "완성한 문서를 보관하는 곳이에요",
    description:
      "작업을 마친 제안서와 발표 구성안이 이곳에 쌓입니다. 완성한 문서를 언제든 다시 열어보고 내보낼 수 있어요.",
  },
  제안서: {
    title: "완성한 제안서를 모아 보는 곳이에요",
    description:
      "지원사업이나 후원 요청처럼 상대를 설득해야 하는 문서를 완성하면 이곳에 정리됩니다.",
  },
  "발표 구성안": {
    title: "완성한 발표 구성안을 모아 보는 곳이에요",
    description:
      "발표 흐름과 슬라이드 구성을 정리한 문서를 완성하면 이곳에 정리됩니다.",
  },
};

const FILTERS = [
  { label: "전체", count: 4 },
  { label: "제안서", count: 2 },
  { label: "발표 구성안", count: 2 },
];

const COMPLETED_PROJECTS = [
  {
    id: 1,
    category: "제안서",
    title: "동아리 지원사업 제안서",
    date: "2026.07.02",
  },
  {
    id: 2,
    category: "발표 구성안",
    title: "신입 부원 모집 발표",
    date: "2026.06.28",
  },
  {
    id: 3,
    category: "발표 구성안",
    title: "봉사활동 성과 발표",
    date: "2026.06.30",
  },
  {
    id: 4,
    category: "제안서",
    title: "학과 행사 후원 제안서",
    date: "2026.06.02",
  },
] as const;

export const CompletedListPage = () => {
  const { isLoggedIn, openLoginModal } = useMainLayoutContext();
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const activeFilter = FILTERS[activeFilterIndex].label;
  const guestPreview = GUEST_PREVIEW_BY_FILTER[activeFilter];
  const filteredProjects =
    activeFilter === "전체"
      ? COMPLETED_PROJECTS
      : COMPLETED_PROJECTS.filter(
          (project) => project.category === activeFilter,
        );

  return (
    <ListLayout
      title="완성본"
      filters={FILTERS}
      activeFilterIndex={activeFilterIndex}
      onFilterChange={setActiveFilterIndex}
      showFilterCounts={isLoggedIn}
    >
      {isLoggedIn ? (
        filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            category={project.category}
            title={project.title}
            date={project.date}
            dateLabel="완성"
            showEditIcon={false}
          />
        ))
      ) : (
        <GuestPreview
          title={guestPreview.title}
          description={guestPreview.description}
          onAction={openLoginModal}
        />
      )}
    </ListLayout>
  );
};

export default CompletedListPage;
