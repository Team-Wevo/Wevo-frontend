import { apiClient } from "../../../shared/api/client";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import type {
  ProjectMemberRole,
  ProjectResultType,
  ProjectStatus,
} from "./projectList";

export interface ProjectSectionProgress {
  total: number;
  confirmed: number;
}

export interface ProjectDetailResponse {
  projectId: number;
  title: string;
  description: string;
  ideaText: string;
  resultType: ProjectResultType;
  audience: string;
  status: ProjectStatus;
  myRole: ProjectMemberRole;
  memberCount: number;
  sectionProgress: ProjectSectionProgress;
}

// 프로젝트 상세 — 내 역할·멤버 수·섹션 진행 요약
export const getProjectDetail = async (
  projectId: number,
): Promise<ProjectDetailResponse> => {
  const response = await apiClient.get<ApiResponse<ProjectDetailResponse>>(
    `/api/projects/${projectId}`,
  );

  return unwrapApiResponse(response.data);
};
