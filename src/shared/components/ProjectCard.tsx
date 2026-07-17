import { Pencil, Presentation, FileText, Crown, Users } from "lucide-react";

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
}

const CATEGORY_STYLE = {
  "발표 구성안": {
    icon: Presentation,
    badge: "bg-purple-100 text-purple-600",
    cardBg: "from-purple-50 to-pink-50",
    iconColor: "text-purple-200",
  },
  제안서: {
    icon: FileText,
    badge: "bg-blue-100 text-blue-600",
    cardBg: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-200",
  },
} as const;

const ROLE_ICON = {
  팀장: Crown,
  팀원: Users,
} as const;

export const ProjectCard = ({
  category,
  title,
  date,
  dateLabel,
  role,
  statusText,
  showEditIcon = true,
}: ProjectCardProps) => {
  const {
    icon: CategoryIcon,
    badge,
    cardBg,
    iconColor,
  } = CATEGORY_STYLE[category];
  const RoleIcon = role ? ROLE_ICON[role] : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition-shadow hover:shadow-md">
      {/* 카드 상단 썸네일 영역 */}
      <div
        className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${cardBg} px-3 pt-3`}
      >
        <span
          className={`absolute top-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge}`}
        >
          <CategoryIcon className="h-3 w-3" />
          {category}
        </span>
        {RoleIcon && role && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] font-medium text-slate-500 backdrop-blur-sm">
            <RoleIcon className="h-3 w-3" />
            {role}
          </span>
        )}
        <CategoryIcon className={`h-10 w-10 ${iconColor}`} />
      </div>

      {/* 카드 하단 정보 영역 */}
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-bold text-slate-900">{title}</h3>
          {showEditIcon && (
            <Pencil className="h-3.5 w-3.5 shrink-0 text-gray-300" />
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-slate-400">
          {statusText && <span className="truncate">{statusText}</span>}
          <span className="shrink-0">
            {date} {dateLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
