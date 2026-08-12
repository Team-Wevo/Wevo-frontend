import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../shared/components/Button";
import { TeamInviteIcon } from "../../../../shared/components/icons/TeamInviteIcon";
import { PRESSABLE_FILL_ICON_STATE_CLASS } from "../../../../shared/styles/buttonStateStyles";
import { cn } from "../../../../shared/utils/cn";
import { getAvatarColorByIndex } from "../../../../shared/utils/avatarColor";
import {
  createInviteLink,
  getCreateInviteLinkErrorMessage,
  type CreateInviteLinkResponse,
} from "../../../project/api/createInviteLink";
import { useProjectMembers } from "../../../project/hooks/useProjectMembers";
import InviteTeamPopover from "./InviteTeamPopover";

export type DraftSaveStatus = "idle" | "saving" | "saved";

interface WorkspaceHeaderProps {
  title: string;
  projectId: string;
  saveStatus?: DraftSaveStatus;
  canInviteMembers: boolean;
  onInvite?: () => void;
  onPreviewAll?: () => void;
}

const HEADER_ACTION_BUTTON_CLASS =
  "h-8 gap-1 rounded-sm px-3 py-2 text-xs leading-4 font-medium";

const WorkspaceHeader = ({
  title,
  projectId,
  saveStatus = "idle",
  canInviteMembers,
  onInvite,
  onPreviewAll,
}: WorkspaceHeaderProps) => {
  const navigate = useNavigate();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const membersQuery = useProjectMembers(Number(projectId), { live: true });
  const [inviteLink, setInviteLink] = useState<CreateInviteLinkResponse | null>(
    null,
  );
  const [isLoadingInviteLink, setIsLoadingInviteLink] = useState(false);
  const [inviteLinkErrorMessage, setInviteLinkErrorMessage] = useState<
    string | null
  >(null);
  const inviteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInviteOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (inviteRef.current && !inviteRef.current.contains(target)) {
        setIsInviteOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsInviteOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isInviteOpen]);

  const handleToggleInvite = async () => {
    if (!canInviteMembers) {
      return;
    }

    onInvite?.();
    setIsInviteOpen((prev) => !prev);

    // 이미 발급받은 링크가 있으면 재사용하고, 없을 때만(최초 오픈) 요청한다.
    if (inviteLink || isLoadingInviteLink) {
      return;
    }

    setIsLoadingInviteLink(true);
    setInviteLinkErrorMessage(null);

    try {
      const result = await createInviteLink(Number(projectId));
      setInviteLink(result);
    } catch (error) {
      setInviteLinkErrorMessage(getCreateInviteLinkErrorMessage(error));
    } finally {
      setIsLoadingInviteLink(false);
    }
  };

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

        <img
          src="/Wevo-logo.svg"
          alt="Wevo"
          className="size-7 shrink-0 object-contain"
        />

        <h1 className="truncate text-[14px] font-medium text-gray-900">
          {title}
        </h1>

        {saveStatus === "saving" && (
          <span className="flex shrink-0 items-center gap-1 text-[12px] text-gray-500">
            저장 중...
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="flex shrink-0 items-center gap-1 text-[12px] text-gray-600">
            <Check className="text-success h-2.5 w-2.5" />
            저장됨
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex -space-x-2">
          {membersQuery.data?.members.slice(0, 4).map((member, index) =>
            member.profileImageUrl ? (
              <img
                key={member.userId}
                src={member.profileImageUrl}
                alt=""
                className="h-7 w-7 rounded-full border-[2px] border-gray-50 object-cover"
              />
            ) : (
              <div
                key={member.userId}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-[2px] border-gray-50 text-[11px] leading-[14px] font-normal text-gray-50",
                  getAvatarColorByIndex(index),
                )}
              >
                {member.name[0]}
              </div>
            ),
          )}
        </div>

        {canInviteMembers && (
          <div
            ref={inviteRef}
            className="relative"
          >
            <Button
              type="pressableStrong"
              onClick={handleToggleInvite}
              className={HEADER_ACTION_BUTTON_CLASS}
            >
              <TeamInviteIcon
                size={14}
                className={cn("p-[1.5px]", PRESSABLE_FILL_ICON_STATE_CLASS)}
              />
              팀원 초대
            </Button>

            {isInviteOpen && (
              <InviteTeamPopover
                projectId={projectId}
                inviteUrl={inviteLink?.inviteUrl ?? null}
                isLoadingInviteUrl={isLoadingInviteLink}
                inviteUrlErrorMessage={inviteLinkErrorMessage}
                onClose={() => setIsInviteOpen(false)}
              />
            )}
          </div>
        )}

        <Button
          type="pressableStrong"
          onClick={onPreviewAll}
          className={HEADER_ACTION_BUTTON_CLASS}
        >
          전체 미리보기
        </Button>
      </div>
    </header>
  );
};

export default WorkspaceHeader;
