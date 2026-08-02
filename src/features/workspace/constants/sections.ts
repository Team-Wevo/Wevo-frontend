export type WorkspaceSectionStatus =
  "COLLECTING" | "SYNTHESIZING" | "DRAFTING" | "REVIEWING" | "CONFIRMED";

export type WorkspaceSectionNo = 1 | 2 | 3 | 4 | 5 | 6;

interface WorkspaceSectionDefinition {
  sectionNo: WorkspaceSectionNo;
  title: string;
}

export const WORKSPACE_SECTION_DEFINITIONS: WorkspaceSectionDefinition[] = [
  { sectionNo: 1, title: "제안 배경" },
  { sectionNo: 2, title: "문제 및 필요성" },
  { sectionNo: 3, title: "목표 및 제안 범위" },
  { sectionNo: 4, title: "제안 내용" },
  { sectionNo: 5, title: "실행 방안" },
  { sectionNo: 6, title: "기대 효과" },
];

export interface WorkspaceSection {
  projectSectionId: number;
  orderNo: WorkspaceSectionNo;
  title: string;
  sectionStatus: WorkspaceSectionStatus;
}

// 여러 상태를 한 번에 확인해볼 수 있도록 섹션마다 다른 status를 채워둔 테스트용 기본값
const DEFAULT_SECTION_STATUS_BY_SECTION_NO: Record<
  WorkspaceSectionNo,
  WorkspaceSectionStatus
> = {
  1: "CONFIRMED",
  2: "COLLECTING",
  3: "SYNTHESIZING",
  4: "REVIEWING",
  5: "DRAFTING",
  6: "CONFIRMED",
};

const toWorkspaceSectionNo = (value: number): WorkspaceSectionNo | null => {
  if (value >= 1 && value <= 6) {
    return value as WorkspaceSectionNo;
  }

  return null;
};

export const isWorkspaceSectionNo = (
  value: number,
): value is WorkspaceSectionNo => {
  return value >= 1 && value <= 6;
};

export const getWorkspaceSectionTitle = (
  sectionNo: WorkspaceSectionNo,
): string => {
  const matched = WORKSPACE_SECTION_DEFINITIONS.find(
    (section) => section.sectionNo === sectionNo,
  );

  return matched?.title ?? "";
};

const buildDefaultSections = (projectId: number): WorkspaceSection[] => {
  return WORKSPACE_SECTION_DEFINITIONS.map(({ sectionNo, title }) => {
    return {
      projectSectionId: projectId * 1000 + sectionNo,
      orderNo: sectionNo,
      title,
      sectionStatus: DEFAULT_SECTION_STATUS_BY_SECTION_NO[sectionNo],
    };
  });
};

const normalizeSections = (
  sections: WorkspaceSection[],
): WorkspaceSection[] => {
  return sections
    .map<WorkspaceSection | null>((section) => {
      const sectionNo = toWorkspaceSectionNo(section.orderNo);

      if (!sectionNo) {
        return null;
      }

      return {
        ...section,
        orderNo: sectionNo,
        title: section.title || getWorkspaceSectionTitle(sectionNo),
      };
    })
    .filter((section): section is WorkspaceSection => Boolean(section));
};

export const getWorkspaceSectionsByProjectId = async (
  projectId: number,
): Promise<WorkspaceSection[]> => {
  // TODO: 프로젝트 상세 API 연동 후 서버 sections를 normalizeSections로 정규화하세요.
  const defaultSections = buildDefaultSections(projectId);
  return normalizeSections(defaultSections);
};
