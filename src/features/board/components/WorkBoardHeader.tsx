import { ArrowLeft, Check, CircleDot, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { cn } from "../../../shared/utils/cn";

export interface Collaborator {
  id: string;
  color: string;
  name: string;
}

interface WorkBoardHeaderProps {
  title: string;
  isSaved: boolean;
  collaborators: Collaborator[];
  onInvite?: () => void;
  onPreviewAll?: () => void;
}

const HEADER_ACTION_BUTTON_CLASS = "gap-1 px-3 py-2 text-[12px] text-gray-700";

const WorkBoardHeader = ({
  title,
  isSaved,
  collaborators,
  onInvite,
  onPreviewAll,
}: WorkBoardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border border-gray-400 px-6 py-1">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          className="flex shrink-0 cursor-pointer items-center rounded-sm text-gray-600"
        >
          <ArrowLeft className="h-3 w-3" />
        </button>

        <div className="bg-main-600 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm">
          <img
            src="/Wevo-logo.svg"
            alt="Wevo"
            className="h-4 w-4 object-contain"
          />
        </div>

        <h1 className="truncate text-[14px] font-medium text-gray-900">
          {title}
        </h1>

        {isSaved && (
          <span className="flex shrink-0 items-center gap-1 text-[12px] text-gray-600">
            <Check className="text-success h-2.5 w-2.5" />
            저장됨
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex -space-x-2">
          {collaborators.slice(0, 4).map((collaborator) => (
            <div
              key={collaborator.id}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-[2px] border-gray-50 text-[11px] leading-[14px] font-normal text-gray-50",
                collaborator.color,
              )}
            >
              {collaborator.name[0]}
            </div>
          ))}
        </div>

        <Button
          base="default"
          onClick={onInvite}
          className={HEADER_ACTION_BUTTON_CLASS}
        >
          <Plus className="h-4 w-4" />
          팀원 초대
        </Button>

        <Button
          base="default"
          onClick={onPreviewAll}
          className={cn(HEADER_ACTION_BUTTON_CLASS)}
        >
          <CircleDot className="h-4 w-4" />
          전체 미리보기
        </Button>
      </div>
    </header>
  );
};

export default WorkBoardHeader;
