import type { WorkspaceSectionStatus } from "../constants/sections";

export type WorkspacePhase = "의견 모으기" | "정리·초안" | "검토·확정";

const WORKSPACE_PHASE_BY_STATUS: Record<
  WorkspaceSectionStatus,
  WorkspacePhase
> = {
  COLLECTING: "의견 모으기",
  SYNTHESIZING: "정리·초안",
  DRAFTING: "정리·초안",
  REVIEWING: "검토·확정",
  CONFIRMED: "검토·확정",
};

export const getWorkspacePhase = (
  status: WorkspaceSectionStatus,
): WorkspacePhase => {
  return WORKSPACE_PHASE_BY_STATUS[status];
};
