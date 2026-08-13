import type { ProjectMemberRole } from "../../project/api/projectList";

export interface WorkspacePermissions {
  isOwner: boolean;
  canInviteMembers: boolean;
  canManageOpinionCollection: boolean;
  canManageIssues: boolean;
  canGenerateDraft: boolean;
  canRequestPrecheck: boolean;
  canApplyPrecheckRevision: boolean;
  canMoveToReviewRequest: boolean;
  canSubmitTeamReview: boolean;
  canResolveTeamReview: boolean;
  canConfirmSection: boolean;
  canCreateExternalReviewLink: boolean;
}

export const getWorkspacePermissions = (
  role: ProjectMemberRole,
): WorkspacePermissions => {
  const isOwner = role === "OWNER";

  return {
    isOwner,
    canInviteMembers: isOwner,
    canManageOpinionCollection: isOwner,
    canManageIssues: isOwner,
    canGenerateDraft: isOwner,
    canRequestPrecheck: isOwner,
    canApplyPrecheckRevision: isOwner,
    canMoveToReviewRequest: isOwner,
    canSubmitTeamReview: !isOwner,
    canResolveTeamReview: isOwner,
    canConfirmSection: isOwner,
    canCreateExternalReviewLink: isOwner,
  };
};
