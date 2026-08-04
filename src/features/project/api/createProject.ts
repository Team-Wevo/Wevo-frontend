import { apiClient } from "../../../shared/api/client";
import type { ApiResponse } from "../../../shared/api/types";
import type {
  ProjectMemberRole,
  ProjectResultType,
  ProjectStatus,
} from "./projectList";

export type WorkspaceSectionStatus =
  "COLLECTING" | "SYNTHESIZING" | "DRAFTING" | "REVIEWING" | "CONFIRMED";

export interface CreateProjectSection {
  sectionId: number;
  order: number;
  title: string;
  sectionStatus: WorkspaceSectionStatus;
  keyQuestion: string;
  guide: string;
}

export interface CreateProjectResponse {
  projectId: number;
  title: string;
  resultType: ProjectResultType;
  status: ProjectStatus;
  myRole: ProjectMemberRole;
  sections: CreateProjectSection[];
}

export interface CreateProjectPayload {
  title: string;
  ideaText: string;
  resultType: ProjectResultType;
  audience: string;
}

// 프로젝트 생성 — 생성자를 OWNER로 등록하고 유형별 고정 6섹션을 자동 생성
export const createProject = async (
  payload: CreateProjectPayload,
): Promise<CreateProjectResponse> => {
  const response = await apiClient.post<ApiResponse<CreateProjectResponse>>(
    "/api/projects",
    payload,
  );

  return response.data.data;
};
