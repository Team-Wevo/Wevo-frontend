export type WorkspaceSectionStatus =
  "COLLECTING" | "SYNTHESIZING" | "DRAFTING" | "REVIEWING" | "COMPLETED";

export interface WorkspaceSection {
  projectSectionId: number;
  orderNo: number;
  sectionStatus: WorkspaceSectionStatus;
}

const DEFAULT_SECTION_STATUSES: WorkspaceSectionStatus[] = [
  "COLLECTING",
  "SYNTHESIZING",
  "DRAFTING",
  "REVIEWING",
  "COMPLETED",
  "COLLECTING",
];

const DEFAULT_SECTION_START_INDEX = 1;

const buildDefaultSections = (projectId: number): WorkspaceSection[] => {
  return DEFAULT_SECTION_STATUSES.map((sectionStatus, index) => {
    const orderNo = index + DEFAULT_SECTION_START_INDEX;

    return {
      projectSectionId: projectId * 1000 + orderNo,
      orderNo,
      sectionStatus,
    };
  });
};

export const getWorkspaceSectionsByProjectId = async (
  projectId: number,
): Promise<WorkspaceSection[]> => {
  // TODO: 프로젝트 상세 API 연동 후 sections 응답을 그대로 반환하세요.
  return buildDefaultSections(projectId);
};
