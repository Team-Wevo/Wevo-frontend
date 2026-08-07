import { apiClient, unwrapApiResponse, type ApiResponse } from "@/shared/api";

export type ProjectMemberRole = "OWNER" | "MEMBER";

export interface ProjectMember {
  userId: number;
  name: string;
  profileImageUrl: string | null;
  role: ProjectMemberRole;
  joinedAt: string;
}

export interface ProjectMembersResponse {
  memberCount: number;
  maxMembers: number;
  members: ProjectMember[];
}

export const getProjectMembers = async (
  projectId: number,
): Promise<ProjectMembersResponse> => {
  const response = await apiClient.get<ApiResponse<ProjectMembersResponse>>(
    `/api/projects/${projectId}/members`,
  );

  return unwrapApiResponse(response.data);
};
