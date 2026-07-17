import {
  Pencil,
  Presentation,
  FileText,
  Crown,
  Users,
  Check,
} from "lucide-react";
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

const CATEGORY_STYLE = {
  "발표 구성안": {
    icon: Presentation,
    badge: "bg-purple-100 text-[#8200DB] border-[0.8px] border-[#E9D4FF]",
    cardBg: "from-purple-50 to-pink-50",
    iconColor: "text-purple-200",
  },
  제안서: {
    icon: FileText,
    badge: "bg-[#dbeafe] text-[#1447E6] border-[0.8px] border-[#BEDBFF]",
    cardBg: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-200",
  },
} as const;

const ROLE_STYLE = {
  팀장: {
    icon: Crown,
    badge: "border-[0.8px] border-[#E4E6EF] text-[#735DF4]",
  },
  팀원: {
    icon: Users,
    badge: "border-[0.8px] border-[#E4E6EF] text-slate-500",
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
  const {
    icon: CategoryIcon,
    badge,
    cardBg,
    iconColor,
  } = CATEGORY_STYLE[category];
  const RoleIcon = role ? ROLE_STYLE[role].icon : null;
  const roleBadge = role ? ROLE_STYLE[role].badge : "";

  return (
    <div
      className={cn(
        "overflow-hidden border bg-white",
        isSelected
          ? "rounded-md border-[0.8px] border-[#735DF4] shadow-[0_0_0_2px_#735DF4]"
          : "rounded-lg border-gray-200",
      )}
    >
      {/* 카드 상단 썸네일 영역 */}
      <div
        className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${cardBg} px-3 pt-3`}
      >
        <span
          className={cn(
            "absolute top-3 left-3 flex items-center justify-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-normal",
            badge,
          )}
        >
          {category}
        </span>
        {isSelectionMode ? (
          <button
            onClick={onToggleSelect}
            className={cn(
              "absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-lg border-[0.8px]",
              isSelected
                ? "border-[#1A1D2E] bg-[#1A1D2E]"
                : "border-[#CDD0DF] bg-white/90",
            )}
          >
            {isSelected && <Check className="h-[15px] w-[15px] text-white" />}
          </button>
        ) : (
          RoleIcon &&
          role && (
            <span
              className={cn(
                "absolute top-3 right-3 flex items-center justify-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[13px] font-normal backdrop-blur-sm",
                roleBadge,
              )}
            >
              <RoleIcon className="h-3 w-3" />
              {role}
            </span>
          )
        )}
        <CategoryIcon
          className={`h-10 w-10 ${iconColor}`}
          strokeWidth={1.5}
        />
      </div>

      {/* 카드 하단 정보 영역 */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[16px] font-bold text-slate-900">
            {title}
          </h3>
          {showEditIcon && !isSelectionMode && (
            <Pencil className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between font-medium text-slate-400">
          {statusText && (
            <span className="truncate text-[12px]">{statusText}</span>
          )}
          <span className="shrink-0 text-[11px]">
            {date} {dateLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
