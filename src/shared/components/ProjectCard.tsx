import { Check } from "lucide-react";
import type { KeyboardEvent } from "react";
import { EditNameIcon, PresentationOutlineIcon, ProposalIcon } from "./icons";
import { cn } from "../utils/cn";

export type ProjectCategory = "발표 구성안" | "제안서";
export type ProjectRole = "팀장" | "팀원";

interface ProjectCardProps {
  category: ProjectCategory;
  title: string;
  date: string;
  dateLabel: string;
  role?: ProjectRole;
  statusText?: string;
  showEditIcon?: boolean;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onOpen?: () => void;
  onEdit?: () => void;
}

const CATEGORY_CONFIG = {
  "발표 구성안": {
    badgeClassName: "bg-main-100 text-main-700",
    icon: PresentationOutlineIcon,
    iconSize: 30,
    iconWrapperClassName: "size-10",
    thumbnailClassName: "bg-main-50",
  },
  제안서: {
    badgeClassName: "bg-blue-100 text-blue-700",
    icon: ProposalIcon,
    iconSize: 32,
    iconWrapperClassName: "size-11",
    thumbnailClassName: "bg-blue-50",
  },
} as const;

export const ProjectCard = ({
  category,
  title,
  date,
  dateLabel,
  role,
  statusText,
  showEditIcon = true,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
  onOpen,
  onEdit,
}: ProjectCardProps) => {
  const categoryConfig = CATEGORY_CONFIG[category];
  const CategoryIcon = categoryConfig.icon;
  const selectHandler = isSelectionMode ? onToggleSelect : undefined;
  const openHandler = isSelectionMode ? undefined : onOpen;
  const isSelectClickable = Boolean(selectHandler);
  const isOpenClickable = Boolean(openHandler);

  const handleActivateKeyDown =
    (handler: (() => void) | undefined) =>
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handler?.();
      }
    };

  return (
    <div
      onClick={selectHandler}
      onKeyDown={
        isSelectClickable ? handleActivateKeyDown(selectHandler) : undefined
      }
      role={isSelectClickable ? "button" : undefined}
      tabIndex={isSelectClickable ? 0 : undefined}
      aria-pressed={isSelectionMode ? isSelected : undefined}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl border bg-gray-50 transition-colors",
        isSelectClickable && "cursor-pointer",
        isSelected ? "border-main-600" : "border-gray-400",
      )}
    >
      {/* 카드 상단 썸네일 영역 — 작업 영역 진입 클릭은 여기로 한정 */}
      <div
        onClick={openHandler}
        onKeyDown={
          isOpenClickable ? handleActivateKeyDown(openHandler) : undefined
        }
        role={isOpenClickable ? "button" : undefined}
        tabIndex={isOpenClickable ? 0 : undefined}
        className={cn(
          "flex h-[124px] shrink-0 flex-col items-start justify-start overflow-hidden p-3 transition-colors",
          isOpenClickable && "cursor-pointer",
          categoryConfig.thumbnailClassName,
        )}
      >
        <div className="flex w-full items-start justify-between overflow-hidden">
          <span
            className={cn(
              "flex items-center justify-center rounded-full px-2 py-1 text-[11px] leading-[14px] font-normal",
              categoryConfig.badgeClassName,
            )}
          >
            {category}
          </span>
          {isSelectionMode ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleSelect?.();
              }}
              aria-label={isSelected ? "프로젝트 선택 해제" : "프로젝트 선택"}
              className={cn(
                "flex size-5 cursor-pointer items-center justify-center rounded-full border",
                isSelected
                  ? "border-main-600 bg-main-600"
                  : "border-gray-400 bg-gray-50",
              )}
            >
              {isSelected && <Check className="h-[15px] w-[15px] text-white" />}
            </button>
          ) : (
            role && (
              <span className="bg-main-100 text-main-700 flex items-center justify-center rounded-full px-2 py-1 text-[11px] leading-[14px] font-normal">
                {role}
              </span>
            )
          )}
        </div>
        <div className="flex w-full flex-1 items-center justify-center overflow-hidden">
          <div
            className={cn(
              "flex items-center justify-center",
              categoryConfig.iconWrapperClassName,
            )}
          >
            <CategoryIcon size={categoryConfig.iconSize} />
          </div>
        </div>
      </div>

      {/* 카드 하단 정보 영역 */}
      <div
        className={cn(
          "flex flex-1 flex-col items-start justify-start gap-2 overflow-hidden border-t border-gray-400 p-4 transition-colors",
        )}
      >
        <div className="flex w-full items-center justify-between overflow-hidden">
          <h3
            className={cn(
              "line-clamp-1 flex-1 text-sm leading-5 font-medium text-gray-900 transition-colors",
            )}
          >
            {title}
          </h3>
          {showEditIcon &&
            (onEdit && !isSelectionMode ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit();
                }}
                aria-label="프로젝트 이름 수정"
                className="flex shrink-0 cursor-pointer items-center justify-center p-0.5"
              >
                <EditNameIcon size={16} />
              </button>
            ) : (
              <EditNameIcon
                size={16}
                className="shrink-0"
              />
            ))}
        </div>
        <div className="flex w-full items-center justify-between overflow-hidden">
          {statusText && (
            <span
              className={cn(
                "truncate text-[13px] leading-5 text-gray-700 transition-colors",
              )}
            >
              {statusText}
            </span>
          )}
          <div className="flex shrink-0 items-start justify-start gap-1 overflow-hidden">
            <span
              className={cn(
                "text-xs leading-[15px] text-gray-600 transition-colors",
              )}
            >
              {date}
            </span>
            <span
              className={cn(
                "text-xs leading-[15px] text-gray-600 transition-colors",
              )}
            >
              {dateLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
