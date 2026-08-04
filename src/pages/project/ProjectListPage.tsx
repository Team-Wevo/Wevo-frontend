import { useEffect, useState } from "react";
import ListLayout from "../../app/layouts/ListLayout";
import CreateFlowModal from "../../features/onboarding/components/modal/CreateFlowModal";
import { getMyProjects } from "../../features/project/api/projectList";
import {
  toProjectListItem,
  type ProjectListItem,
} from "../../features/project/utils/toProjectListItem";
import {
  ProjectCard,
  type ProjectRole,
} from "../../shared/components/ProjectCard";
import { ConfirmModal } from "../../shared/components/ConfirmModal";
import { Button } from "../../shared/components/Button";
import { ProjectIcon } from "../../shared/components/icons";
import { PRESSABLE_STROKE_ICON_STATE_CLASS } from "../../shared/styles/buttonStateStyles";

const ROLE_BY_FILTER: Record<string, ProjectRole> = {
  "내가 만든": "팀장",
  공유받은: "팀원",
};

export const ProjectListPage = () => {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    getMyProjects()
      .then((response) => {
        if (isCancelled) return;
        setProjects(response.map(toProjectListItem));
      })
      .catch(() => {
        if (isCancelled) return;
        setErrorMessage("프로젝트 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const FILTERS = [
    { label: "전체", count: projects.length },
    {
      label: "내가 만든",
      count: projects.filter((project) => project.role === "팀장").length,
    },
    {
      label: "공유받은",
      count: projects.filter((project) => project.role === "팀원").length,
    },
  ];

  const activeFilter = FILTERS[activeFilterIndex].label;
  const filteredProjects =
    activeFilter === "전체"
      ? projects
      : projects.filter(
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

  const handleOpenCreateModal = () => {
    setCreateModalKey((prev) => prev + 1);
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <ListLayout
        title="프로젝트"
        filters={FILTERS}
        activeFilterIndex={activeFilterIndex}
        onFilterChange={setActiveFilterIndex}
        actions={
          isSelectionMode ? (
            <>
              <Button
                type="pressableStrong"
                onClick={handleSelectAll}
              >
                <span>전체 선택</span>
              </Button>
              <Button
                type="pressableDanger"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={selectedIds.size === 0}
              >
                <span>삭제</span>
              </Button>
              <Button
                type="pressable"
                onClick={handleCancelSelection}
              >
                <span>취소</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="pressableStrong"
                onClick={handleOpenCreateModal}
              >
                <span className="flex size-4 items-center justify-center">
                  <ProjectIcon
                    size={10}
                    className={PRESSABLE_STROKE_ICON_STATE_CLASS}
                  />
                </span>
                <span>새 프로젝트</span>
              </Button>
              <Button
                type="pressableStrong"
                onClick={() => setIsSelectionMode(true)}
              >
                <span>선택 삭제</span>
              </Button>
            </>
          )
        }
      >
        {isLoading && (
          <p className="col-span-4 text-sm text-gray-600">
            프로젝트 목록을 불러오는 중이에요...
          </p>
        )}
        {errorMessage && (
          <p className="text-error col-span-4 text-sm">{errorMessage}</p>
        )}
        {!isLoading &&
          !errorMessage &&
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              category={project.category}
              role={project.role}
              title={project.title}
              statusText={project.statusText}
              date={project.date}
              dateLabel="생성"
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.has(project.id)}
              onToggleSelect={() => toggleSelect(project.id)}
            />
          ))}
        {isDeleteModalOpen && (
          <ConfirmModal
            title="프로젝트를 삭제할까요?"
            description={
              <>
                선택한 {selectedIds.size}개의 프로젝트가 삭제돼요. 이 작업은
                되돌릴 수 없어요.
              </>
            }
            confirmLabel="삭제"
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </ListLayout>

      <CreateFlowModal
        key={createModalKey}
        isOpen={isCreateModalOpen}
        initialDocumentType={null}
        initialIdea=""
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default ProjectListPage;
