import { Check } from "lucide-react";
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
}: ProjectCardProps) => {
  const categoryConfig = CATEGORY_CONFIG[category];
  const CategoryIcon = categoryConfig.icon;

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl bg-gray-50",
        isSelected ? "border-main-600 border-[2px]" : "border border-gray-400",
      )}
    >
      {/* 카드 상단 썸네일 영역 */}
      <div
        className={cn(
          "flex h-[124px] shrink-0 flex-col items-start justify-start overflow-hidden p-3",
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
              onClick={onToggleSelect}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-[0.8px]",
                isSelected
                  ? "border-main-600 bg-main-600"
                  : "border-gray-300 bg-white/90",
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
      <div className="flex flex-1 flex-col items-start justify-start gap-2 overflow-hidden border-t border-gray-400 p-4">
        <div className="flex w-full items-center justify-between overflow-hidden">
          <h3 className="line-clamp-1 flex-1 text-sm leading-5 font-medium text-gray-900">
            {title}
          </h3>
          {showEditIcon && !isSelectionMode && (
            <EditNameIcon
              size={16}
              className="shrink-0"
            />
          )}
        </div>
        <div className="flex w-full items-center justify-between overflow-hidden">
          {statusText && (
            <span className="truncate text-[13px] leading-5 text-gray-700">
              {statusText}
            </span>
          )}
          <div className="flex shrink-0 items-start justify-start gap-1 overflow-hidden">
            <span className="text-xs leading-[15px] text-gray-600">{date}</span>
            <span className="text-xs leading-[15px] text-gray-600">
              {dateLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
