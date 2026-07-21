import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ListLayout from "../app/layouts/ListLayout";
import {
  ProjectCard,
  type ProjectRole,
} from "../shared/components/ProjectCard";
import { ConfirmModal } from "../shared/components/ConfirmModal";
import { cn } from "../shared/utils/cn";

const FILTERS = [
  { label: "전체", count: 8 },
  { label: "내가 만든", count: 4 },
  { label: "공유받은", count: 4 },
];

const ROLE_BY_FILTER: Record<string, ProjectRole> = {
  "내가 만든": "팀장",
  공유받은: "팀원",
};

const SECONDARY_BUTTON_CLASS =
  "flex h-9 shrink-0 items-center justify-center rounded-md bg-[#F0F1F7] px-4 py-2 text-sm text-[#5C6080] transition-colors hover:bg-gray-200";

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
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const activeFilter = FILTERS[activeFilterIndex].label;
  const filteredProjects =
    activeFilter === "전체"
      ? PROJECTS
      : PROJECTS.filter(
          (project) => project.role === ROLE_BY_FILTER[activeFilter],
        );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size === filteredProjects.length
        ? new Set()
        : new Set(filteredProjects.map((project) => project.id)),
    );
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleConfirmDelete = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <ListLayout
      title="프로젝트"
      filters={FILTERS}
      activeFilterIndex={activeFilterIndex}
      onFilterChange={setActiveFilterIndex}
      actions={
        isSelectionMode ? (
          <>
            <button
              onClick={handleSelectAll}
              className={SECONDARY_BUTTON_CLASS}
            >
              <span>전체선택</span>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={selectedIds.size === 0}
              className={cn(
                "flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-normal text-white transition-colors",
                selectedIds.size === 0
                  ? "cursor-not-allowed bg-[#F0F1F7] text-[#9399B2]"
                  : "bg-[#FB2C36]",
              )}
            >
              <Trash2 className="h-4 w-4" />
              <span>삭제 {selectedIds.size}</span>
            </button>
            <button
              onClick={handleCancelSelection}
              className={SECONDARY_BUTTON_CLASS}
            >
              <span>취소</span>
            </button>
          </>
        ) : (
          <>
            <button className="bg-main hover:bg-main/90 flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-normal text-white transition-colors">
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>새 프로젝트</span>
            </button>
            <button
              onClick={() => setIsSelectionMode(true)}
              className={SECONDARY_BUTTON_CLASS}
            >
              <span>선택 삭제</span>
            </button>
          </>
        )
      }
    >
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          category={project.category}
          role={project.role}
          title={project.title}
          statusText={project.status}
          date={project.date}
          dateLabel="수정"
          isSelectionMode={isSelectionMode}
          isSelected={selectedIds.has(project.id)}
          onToggleSelect={() => toggleSelect(project.id)}
        />
      ))}
      {isDeleteModalOpen && (
        <ConfirmModal
          icon={<Trash2 className="h-5 w-5 text-[#FB2C36]" />}
          title="프로젝트를 삭제할까요?"
          description={
            <>
              선택한 {selectedIds.size}개의 프로젝트가 삭제돼요.
              <br />이 작업은 되돌릴 수 없어요.
            </>
          }
          confirmLabel="삭제"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </ListLayout>
  );
};

export default ProjectListPage;
