import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ListLayout from "../app/layouts/ListLayout";
import { ProjectCard } from "../shared/components/ProjectCard";

const FILTERS = [
  { label: "전체", count: 8 },
  { label: "내가 만든", count: 4 },
  { label: "공유받은", count: 4 },
];

const PROJECTS = [
  {
    id: 1,
    category: "발표 구성안",
    role: "팀장",
    title: "PM Day 발표 준비",
    status: "해결 방향 작성 중",
    date: "2026.07.06",
  },
  {
    id: 2,
    category: "제안서",
    role: "팀장",
    title: "캡스톤 서비스 제안서",
    status: "아이디어 구체화 중",
    date: "2026.07.04",
  },
  {
    id: 3,
    category: "제안서",
    role: "팀원",
    title: "대외활동 기획안",
    status: "추가 근거 요청받음",
    date: "2026.07.06",
  },
  {
    id: 4,
    category: "발표 구성안",
    role: "팀원",
    title: "팀플 발표 구성안",
    status: "검토 진행 중",
    date: "2026.07.05",
  },
  {
    id: 5,
    category: "제안서",
    role: "팀원",
    title: "동아리 지원사업 제안서",
    status: "모든 섹션 확정 완료",
    date: "2026.07.02",
  },
  {
    id: 6,
    category: "발표 구성안",
    role: "팀장",
    title: "논문 발표 자료",
    status: "핵심 기능 작성 중",
    date: "2026.06.30",
  },
  {
    id: 7,
    category: "제안서",
    role: "팀원",
    title: "창업 아이디어 제안서",
    status: "아이디어 구체화 중",
    date: "2026.06.28",
  },
  {
    id: 8,
    category: "발표 구성안",
    role: "팀장",
    title: "해커톤 발표 준비",
    status: "쟁점 조율 중",
    date: "2026.07.05",
  },
] as const;

export const ProjectListPage = () => {
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);

  return (
    <ListLayout
      title="프로젝트"
      filters={FILTERS}
      activeFilterIndex={activeFilterIndex}
      onFilterChange={setActiveFilterIndex}
      actions={
        <>
          <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>새 프로젝트</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
            <Trash2 className="h-4 w-4" />
            <span>선택 삭제</span>
          </button>
        </>
      }
    >
      {PROJECTS.map((project) => (
        <ProjectCard
          key={project.id}
          category={project.category}
          role={project.role}
          title={project.title}
          statusText={project.status}
          date={project.date}
          dateLabel="수정"
        />
      ))}
    </ListLayout>
  );
};

export default ProjectListPage;
