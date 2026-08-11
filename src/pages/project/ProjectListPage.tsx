import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListLayout from "../../app/layouts/ListLayout";
import { useMainLayoutContext } from "../../app/layouts/mainLayoutContext";
import CreateFlowModal from "../../features/onboarding/components/modal/CreateFlowModal";
import {
  deleteProject,
  getDeleteProjectErrorMessage,
} from "../../features/project/api/deleteProject";
import { getMyProjects } from "../../features/project/api/projectList";
import {
  getUpdateProjectErrorMessage,
  updateProject,
} from "../../features/project/api/updateProject";
import { RenameProjectModal } from "../../features/project/components/RenameProjectModal";
import {
  toProjectListItem,
  type ProjectListItem,
} from "../../features/project/utils/toProjectListItem";
import {
  ProjectCard,
  type ProjectRole,
} from "../../shared/components/ProjectCard";
import { ConfirmModal } from "../../shared/components/ConfirmModal";
import { GuestPreview } from "../../shared/components/GuestPreview";
import { Button } from "../../shared/components/Button";
import { ProjectIcon } from "../../shared/components/icons";
import { PRESSABLE_STROKE_ICON_STATE_CLASS } from "../../shared/styles/buttonStateStyles";

const ROLE_BY_FILTER: Record<string, ProjectRole> = {
  "내가 만든": "팀장",
  공유받은: "팀원",
};

const GUEST_PREVIEW_BY_FILTER: Record<
  string,
  { title: string; descriptions: string[] }
> = {
  전체: {
    title: "팀과 함께 만드는 문서가 모이는 곳이에요",
    descriptions: [
      "아이디어를 정리하고 팀원의 의견을 모아 초안까지 완성해 나가는 공간입니다.",
      "새 프로젝트를 만들고 팀원을 초대할 수 있어요.",
    ],
  },
  "내가 만든": {
    title: "내가 시작한 프로젝트만 모아 보는 곳이에요",
    descriptions: [
      "직접 만든 프로젝트가 이곳에 쌓입니다.",
      "팀장으로서 팀원을 초대하고 문서가 완성되기까지의 흐름을 이끌어갈 수 있어요.",
    ],
  },
  공유받은: {
    title: "팀원이 초대한 프로젝트가 모이는 곳이에요",
    descriptions: [
      "다른 사람이 만든 프로젝트에 참여하면 이곳에서 확인할 수 있습니다.",
      "의견을 남기고 함께 문서를 다듬어 나가요.",
    ],
  },
};

export const ProjectListPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openLoginModal } = useMainLayoutContext();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(isLoggedIn);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalKey, setCreateModalKey] = useState(0);
  const [editingProject, setEditingProject] = useState<ProjectListItem | null>(
    null,
  );
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameErrorMessage, setRenameErrorMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // 비로그인 상태에서 호출하면 401 인터셉터가 홈으로 강제 이동시키므로 요청하지 않는다.
    if (!isLoggedIn) return;

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
  }, [isLoggedIn]);

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

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteErrorMessage(null);

    try {
      await Promise.all(Array.from(selectedIds).map((id) => deleteProject(id)));
      setProjects((prev) =>
        prev.filter((project) => !selectedIds.has(project.id)),
      );
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      setDeleteErrorMessage(getDeleteProjectErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCreateModalKey((prev) => prev + 1);
    setIsCreateModalOpen(true);
  };

  const handleCancelRename = () => {
    setEditingProject(null);
    setRenameErrorMessage(null);
  };

  const handleSubmitRename = async (title: string) => {
    if (!editingProject) return;

    setIsRenaming(true);
    setRenameErrorMessage(null);

    try {
      const updated = await updateProject(editingProject.id, { title });
      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id
            ? { ...project, title: updated.title }
            : project,
        ),
      );
      setEditingProject(null);
    } catch (error) {
      setRenameErrorMessage(getUpdateProjectErrorMessage(error));
    } finally {
      setIsRenaming(false);
    }
  };

  const guestPreview = GUEST_PREVIEW_BY_FILTER[activeFilter];

  return (
    <>
      <ListLayout
        title="프로젝트"
        filters={FILTERS}
        activeFilterIndex={activeFilterIndex}
        onFilterChange={setActiveFilterIndex}
        showFilterCounts={isLoggedIn}
        actions={
          !isLoggedIn ? undefined : isSelectionMode ? (
            <>
              <Button
                type="pressableStrong"
                onClick={handleSelectAll}
              >
                <span>전체 선택</span>
              </Button>
              <Button
                type="pressableDanger"
                onClick={() => {
                  setDeleteErrorMessage(null);
                  setIsDeleteModalOpen(true);
                }}
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
        {!isLoggedIn && (
          <GuestPreview
            title={guestPreview.title}
            descriptions={guestPreview.descriptions}
            onAction={openLoginModal}
          />
        )}
        {isLoggedIn && isLoading && (
          <p className="col-span-4 text-sm text-gray-600">
            프로젝트 목록을 불러오는 중이에요...
          </p>
        )}
        {isLoggedIn && errorMessage && (
          <p className="text-error col-span-4 text-sm">{errorMessage}</p>
        )}
        {isLoggedIn &&
          !isLoading &&
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
              onOpen={() => navigate(`/workspace/${project.id}/sections/1`)}
              onEdit={() => setEditingProject(project)}
            />
          ))}
        {isDeleteModalOpen && (
          <ConfirmModal
            title="프로젝트를 삭제할까요?"
            description={
              <>
                선택한 {selectedIds.size}개의 프로젝트가 삭제돼요. 이 작업은
                되돌릴 수 없어요.
                {deleteErrorMessage && (
                  <span className="text-error mt-2 block">
                    {deleteErrorMessage}
                  </span>
                )}
              </>
            }
            confirmLabel={isDeleting ? "삭제 중..." : "삭제"}
            onCancel={() => {
              if (isDeleting) return;
              setDeleteErrorMessage(null);
              setIsDeleteModalOpen(false);
            }}
            onConfirm={handleConfirmDelete}
          />
        )}
        {editingProject && (
          <RenameProjectModal
            initialTitle={editingProject.title}
            isSubmitting={isRenaming}
            errorMessage={renameErrorMessage}
            onCancel={handleCancelRename}
            onSubmit={handleSubmitRename}
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
