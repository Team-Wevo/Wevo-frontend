export type WorkspaceSectionStatus =
  "COLLECTING" | "SYNTHESIZING" | "DRAFTING" | "REVIEWING" | "CONFIRMED";

export type WorkspaceSectionNo = 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkspaceSection {
  projectSectionId: number;
  orderNo: WorkspaceSectionNo;
  title: string;
  sectionStatus: WorkspaceSectionStatus;
  keyQuestion: string;
  guide: string;
}

export const isWorkspaceSectionNo = (
  value: number,
): value is WorkspaceSectionNo => {
  return value >= 1 && value <= 6;
};
