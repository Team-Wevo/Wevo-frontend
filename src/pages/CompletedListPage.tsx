import { useState } from "react";
import ListLayout from "../app/layouts/ListLayout";
import { ProjectCard } from "../shared/components/ProjectCard";

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
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const activeFilter = FILTERS[activeFilterIndex].label;
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
    >
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          category={project.category}
          title={project.title}
          date={project.date}
          dateLabel="완성"
          showEditIcon={false}
        />
      ))}
    </ListLayout>
  );
};

export default CompletedListPage;
