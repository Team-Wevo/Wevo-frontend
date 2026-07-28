import type { SectionStatusValue } from "../../../shared/types/documentType";
import type { WorkspaceSectionStatus } from "../constants/sections";

const SECTION_STATUS_VALUE_BY_WORKSPACE_STATUS: Record<
  WorkspaceSectionStatus,
  SectionStatusValue
> = {
  COLLECTING: "의견 모으기",
  SYNTHESIZING: "정리·초안",
  DRAFTING: "정리·초안",
  REVIEWING: "검토·확정",
  COMPLETED: "작성 완료",
};

export const toSectionStatusValue = (
  status: WorkspaceSectionStatus,
): SectionStatusValue => SECTION_STATUS_VALUE_BY_WORKSPACE_STATUS[status];
