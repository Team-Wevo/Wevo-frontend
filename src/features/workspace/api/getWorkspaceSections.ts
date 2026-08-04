import { apiClient } from "../../../shared/api/client";
import type { ApiResponse } from "../../../shared/api/types";
import {
  isWorkspaceSectionNo,
  type WorkspaceSection,
  type WorkspaceSectionStatus,
} from "../constants/sections";

interface SectionSummaryResponse {
  sectionId: number;
  order: number;
  title: string;
  sectionStatus: WorkspaceSectionStatus;
  keyQuestion: string;
  guide: string;
}

const toWorkspaceSection = (
  response: SectionSummaryResponse,
): WorkspaceSection | null => {
  if (!isWorkspaceSectionNo(response.order)) {
    return null;
  }

  return {
    projectSectionId: response.sectionId,
    orderNo: response.order,
    title: response.title,
    sectionStatus: response.sectionStatus,
    keyQuestion: response.keyQuestion,
    guide: response.guide,
  };
};

// 섹션 목록 — 상태·핵심 질문·작성 가이드 (order 오름차순으로 내려옴)
export const getWorkspaceSectionsByProjectId = async (
  projectId: number,
): Promise<WorkspaceSection[]> => {
  const response = await apiClient.get<ApiResponse<SectionSummaryResponse[]>>(
    `/api/projects/${projectId}/sections`,
  );

  return response.data.data
    .map(toWorkspaceSection)
    .filter((section): section is WorkspaceSection => section !== null);
};
