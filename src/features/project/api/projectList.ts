import { apiClient } from "../../../shared/api/client";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export type ProjectResultType = "PROPOSAL" | "PRESENTATION";
export type ProjectStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type ProjectMemberRole = "OWNER" | "MEMBER";
export type ProjectSectionStatus =
  "COLLECTING" | "SYNTHESIZING" | "DRAFTING" | "REVIEWING" | "CONFIRMED";

export interface ProjectSectionProgress {
  total: number;
  confirmed: number;
}

export interface LastActiveSectionResponse {
  sectionId: number;
  order: number;
  title: string;
  sectionStatus: ProjectSectionStatus;
}

export interface ProjectSummaryResponse {
  projectId: number;
  title: string;
  resultType: ProjectResultType;
  status: ProjectStatus;
  myRole: ProjectMemberRole;
  createdAt: string;
  lastActiveSection: LastActiveSectionResponse;
  sectionProgress: ProjectSectionProgress;
}

const getProjects = async (): Promise<ProjectSummaryResponse[]> => {
  const response =
    await apiClient.get<ApiResponse<ProjectSummaryResponse[]>>("/api/projects");

  return unwrapApiResponse(response.data);
};

// 내 프로젝트 목록 — 멤버인 것만, 보관(ARCHIVED) 제외, 최신순으로 서버에서 내려줌
export const getMyProjects = (): Promise<ProjectSummaryResponse[]> =>
  getProjects();

// 완성본 목록 — 모든 섹션이 확정되어 최종 결과물을 조회할 수 있는 프로젝트만 반환
export const getCompletedProjects = async (): Promise<
  ProjectSummaryResponse[]
> => {
  const projects = await getProjects();

  return projects.filter(
    ({ sectionProgress }) =>
      sectionProgress.total > 0 &&
      sectionProgress.confirmed === sectionProgress.total,
  );
};
