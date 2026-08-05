import { apiClient } from "../../../shared/api/client";
import type { ApiResponse } from "../../../shared/api/types";

export type ProjectResultType = "PROPOSAL" | "PRESENTATION";
export type ProjectStatus =
  "COLLECTING" | "SYNTHESIZING" | "DRAFTING" | "REVIEWING" | "CONFIRMED";
export type ProjectMemberRole = "OWNER" | "MEMBER";

export interface ProjectSummaryResponse {
  projectId: number;
  title: string;
  resultType: ProjectResultType;
  status: ProjectStatus;
  myRole: ProjectMemberRole;
  createdAt: string;
}

// 내 프로젝트 목록 — 멤버인 것만, 보관(ARCHIVED) 제외, 최신순으로 서버에서 내려줌
export const getMyProjects = async (): Promise<ProjectSummaryResponse[]> => {
  const response =
    await apiClient.get<ApiResponse<ProjectSummaryResponse[]>>("/api/projects");

  return response.data.data;
};
