import type {
  ProjectCategory,
  ProjectRole,
} from "../../../shared/components/ProjectCard";
import type {
  ProjectMemberRole,
  ProjectResultType,
  ProjectSummaryResponse,
} from "../api/projectList";

export interface ProjectListItem {
  id: number;
  category: ProjectCategory;
  role: ProjectRole;
  title: string;
  statusText: string;
  date: string;
}

const RESULT_TYPE_TO_CATEGORY: Record<ProjectResultType, ProjectCategory> = {
  PROPOSAL: "제안서",
  PRESENTATION: "발표 구성안",
};

const MEMBER_ROLE_TO_LABEL: Record<ProjectMemberRole, ProjectRole> = {
  OWNER: "팀장",
  MEMBER: "팀원",
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export const toProjectListItem = (
  response: ProjectSummaryResponse,
): ProjectListItem => ({
  id: response.projectId,
  category: RESULT_TYPE_TO_CATEGORY[response.resultType],
  role: MEMBER_ROLE_TO_LABEL[response.myRole],
  title: response.title,
  // TODO: 한글 라벨 매핑 필요해지면 여기서 교체
  statusText: response.status,
  date: formatDate(response.createdAt),
});
