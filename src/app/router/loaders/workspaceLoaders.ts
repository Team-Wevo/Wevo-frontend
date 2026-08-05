import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import {
  getProjectDetail,
  type ProjectDetailResponse,
} from "../../../features/project/api/getProjectDetail";
import { getWorkspaceSectionsByProjectId } from "../../../features/workspace/api/getWorkspaceSections";
import {
  getSectionOpinions,
  type SectionOpinionsResponse,
} from "../../../features/workspace/api/getSectionOpinions";
import {
  isWorkspaceSectionNo,
  type WorkspaceSection,
  type WorkspaceSectionNo,
} from "../../../features/workspace/constants/sections";

const DEFAULT_PROJECT_REDIRECT_PATH = "/list/project";
const DEFAULT_SECTION_NO = 1;

const toPositiveNumber = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
};

const buildWorkspaceSectionPath = (projectId: number, sectionNo: number) => {
  return `/workspace/${projectId}/sections/${sectionNo}`;
};

const findSectionByOrderNo = (
  sections: WorkspaceSection[],
  sectionNo: WorkspaceSectionNo,
): WorkspaceSection | null => {
  return sections.find((section) => section.orderNo === sectionNo) ?? null;
};

const getFallbackSectionNo = (sections: WorkspaceSection[]): number => {
  return sections[0]?.orderNo ?? DEFAULT_SECTION_NO;
};

export interface WorkspaceSectionLoaderData {
  projectId: number;
  sectionNo: number;
  sections: WorkspaceSection[];
  currentSection: WorkspaceSection;
  projectDetail: ProjectDetailResponse;
  opinions: SectionOpinionsResponse | null;
}

export const workspaceIndexLoader = ({ params }: LoaderFunctionArgs) => {
  const projectId = toPositiveNumber(params.projectId);

  if (!projectId) {
    return redirect(DEFAULT_PROJECT_REDIRECT_PATH);
  }

  return redirect(buildWorkspaceSectionPath(projectId, DEFAULT_SECTION_NO));
};

export const workspaceSectionLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<WorkspaceSectionLoaderData | Response> => {
  const projectId = toPositiveNumber(params.projectId);
  const sectionNo = toPositiveNumber(params.sectionNo);

  if (!projectId) {
    return redirect(DEFAULT_PROJECT_REDIRECT_PATH);
  }

  const [sections, projectDetail] = await Promise.all([
    getWorkspaceSectionsByProjectId(projectId),
    getProjectDetail(projectId),
  ]);
  const fallbackSectionNo = getFallbackSectionNo(sections);

  if (!sectionNo) {
    return redirect(buildWorkspaceSectionPath(projectId, fallbackSectionNo));
  }

  if (!isWorkspaceSectionNo(sectionNo)) {
    return redirect(buildWorkspaceSectionPath(projectId, fallbackSectionNo));
  }

  const currentSection = findSectionByOrderNo(sections, sectionNo);

  if (!currentSection) {
    return redirect(buildWorkspaceSectionPath(projectId, fallbackSectionNo));
  }

  // 의견 모으기 단계에서만 필요한 데이터이므로, 다른 단계에서는 불필요한 요청을 보내지 않는다.
  const opinions =
    currentSection.sectionStatus === "COLLECTING"
      ? (await getSectionOpinions(currentSection.projectSectionId)).data
      : null;

  return {
    projectId,
    sectionNo,
    sections,
    currentSection,
    projectDetail,
    opinions,
  };
};
