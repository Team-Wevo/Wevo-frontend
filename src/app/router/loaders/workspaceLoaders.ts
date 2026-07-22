import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import {
  getWorkspaceSectionsByProjectId,
  type WorkspaceSection,
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
  sectionNo: number,
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

  const sections = await getWorkspaceSectionsByProjectId(projectId);
  const fallbackSectionNo = getFallbackSectionNo(sections);

  if (!sectionNo) {
    return redirect(buildWorkspaceSectionPath(projectId, fallbackSectionNo));
  }

  const currentSection = findSectionByOrderNo(sections, sectionNo);

  if (!currentSection) {
    return redirect(buildWorkspaceSectionPath(projectId, fallbackSectionNo));
  }

  return {
    projectId,
    sectionNo,
    sections,
    currentSection,
  };
};
