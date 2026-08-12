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
  getMyOpinion,
  type MyOpinionResponse,
} from "../../../features/workspace/api/getMyOpinion";
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
  sectionId: number;
  sections: WorkspaceSection[];
  currentSection: WorkspaceSection;
  projectDetail: ProjectDetailResponse;
  opinions: SectionOpinionsResponse | null;
  myOpinion: MyOpinionResponse | null;
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
  request,
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

  const requestedView = new URL(request.url).searchParams.get("view");
  const isCollecting = currentSection.sectionStatus === "COLLECTING";
  const shouldLoadOpinions = isCollecting || requestedView === "collecting";

  // 현재 의견 작성 화면과 이전 의견 조회 화면에서만 의견 데이터를 불러온다.
  // 내 의견 단건은 수정에만 필요하므로 현재 의견 모으기 단계에서만 요청한다.
  const [opinions, myOpinion] = await Promise.all([
    shouldLoadOpinions
      ? getSectionOpinions(currentSection.projectSectionId)
      : Promise.resolve(null),
    isCollecting
      ? getMyOpinion(currentSection.projectSectionId)
      : Promise.resolve(null),
  ]);

  return {
    projectId,
    sectionNo,
    sectionId: currentSection.projectSectionId,
    sections,
    currentSection,
    projectDetail,
    opinions,
    myOpinion,
  };
};
