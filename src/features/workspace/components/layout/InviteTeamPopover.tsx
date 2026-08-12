import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Link2 } from "lucide-react";
import { getApiErrorMessage } from "@/shared/api";
import { PRESSABLE_COPY_BUTTON_STATE_CLASS } from "@/shared/styles/buttonStateStyles";
import { cn } from "../../../../shared/utils/cn";
import { getAvatarColorByIndex } from "../../../../shared/utils/avatarColor";
import {
  getProjectMembers,
  type ProjectMemberRole,
} from "../../../project/api/getProjectMembers";

const ROLE_LABEL: Record<ProjectMemberRole, string> = {
  OWNER: "팀장",
  MEMBER: "팀원",
};

const MAX_MEMBER_COUNT_FALLBACK = 4;
const COPY_FEEDBACK_DURATION_MS = 1500;
const MEMBERS_FALLBACK_MESSAGE = "팀원 목록을 불러오지 못했습니다.";

// 링크 박스에는 스킴(https://) 없이 보여준다.
const toDisplayUrl = (url: string) => url.replace(/^https?:\/\//, "");

interface InviteTeamPopoverProps {
  projectId: string;
  inviteUrl: string | null;
  isLoadingInviteUrl: boolean;
  inviteUrlErrorMessage: string | null;
  onClose: () => void;
}

const InviteTeamPopover = ({
  projectId,
  inviteUrl,
  isLoadingInviteUrl,
  inviteUrlErrorMessage,
  onClose,
}: InviteTeamPopoverProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const membersQuery = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => getProjectMembers(Number(projectId)),
  });

  const handleCopyLink = async () => {
    if (!inviteUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), COPY_FEEDBACK_DURATION_MS);
    } catch {
      // TODO: 클립보드 접근 실패 시 사용자 안내
    }
  };

  return (
    <div
      data-invite-popover="true"
      className="absolute top-full right-0 z-50 mt-2 flex w-80 flex-col gap-3 rounded-[16px] border border-[#CDD0DF] bg-white p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm leading-[22px] font-[600] text-gray-900">
          팀원 초대
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="cursor-pointer text-base leading-[26px] font-normal text-gray-600 transition-colors hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      <p className="text-xs leading-[15px] font-normal text-gray-700">
        초대 링크로 이 프로젝트에 팀원을 초대할 수 있어요. 최대{" "}
        {membersQuery.data?.maxMembers ?? MAX_MEMBER_COUNT_FALLBACK}명까지
        참여할 수 있어요.
      </p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 rounded-[8px] border border-[#E4E6EF] bg-[#F0F1F7] px-3 py-2">
          <Link2 className="text-processing h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 truncate text-[11px] leading-[14px] font-normal text-gray-700">
            {isLoadingInviteUrl
              ? "링크 생성 중..."
              : inviteUrl
                ? toDisplayUrl(inviteUrl)
                : (inviteUrlErrorMessage ?? "링크를 불러오지 못했어요.")}
          </span>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleCopyLink}
            disabled={!inviteUrl}
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-[6px] border px-2.5 py-1 text-[11px] leading-[14px] font-normal",
              PRESSABLE_COPY_BUTTON_STATE_CLASS,
            )}
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3" />
                복사됨
              </>
            ) : (
              "링크 복사"
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] leading-[14px] font-normal text-gray-600">
          참여 중{" "}
          {membersQuery.data
            ? `${membersQuery.data.memberCount}/${membersQuery.data.maxMembers}명`
            : "..."}
        </span>

        {membersQuery.isLoading && (
          <span className="text-[11px] leading-[14px] font-normal text-gray-600">
            불러오는 중...
          </span>
        )}

        {membersQuery.isError && (
          <span className="text-error text-[11px] leading-[14px] font-normal">
            {getApiErrorMessage(membersQuery.error, MEMBERS_FALLBACK_MESSAGE)}
          </span>
        )}

        {membersQuery.data?.members.map((member, index) => (
          <div
            key={member.userId}
            className="flex items-center gap-2"
          >
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt=""
                className="h-5 w-5 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] leading-[14px] font-normal text-gray-50",
                  getAvatarColorByIndex(index),
                )}
              >
                {member.name[0]}
              </div>
            )}
            <span className="flex-1 truncate text-xs leading-[15px] font-normal text-gray-900">
              {member.name}
            </span>
            <span className="text-[11px] leading-[14px] font-normal text-gray-600">
              {ROLE_LABEL[member.role]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InviteTeamPopover;
