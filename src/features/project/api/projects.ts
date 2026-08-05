import { isAxiosError } from "axios";
import { apiClient } from "../../../shared/api/client";
import type { ApiResponse } from "../../../shared/api/types";

export type ProjectResultType = "PROPOSAL" | "PRESENTATION";

export type ProjectStatus = "ACTIVE" | "COMPLETED";

export type ProjectRole = "OWNER" | "MEMBER";

export type ProjectSectionStatus =
  "COLLECTING" | "SYNTHESIZING" | "DRAFTING" | "REVIEWING" | "CONFIRMED";

export interface CreateProjectRequest {
  title?: string;
  ideaText: string;
  resultType: ProjectResultType;
  audience: string;
}

export interface CreateProjectSection {
  sectionId: number;
  order: number;
  title: string;
  sectionStatus: ProjectSectionStatus;
  keyQuestion: string;
  guide: string;
}

export interface CreateProjectResponseData {
  projectId: number;
  title: string;
  resultType: ProjectResultType;
  status: ProjectStatus;
  myRole: ProjectRole;
  sections: CreateProjectSection[];
}

const CREATE_PROJECT_PATH = "/api/projects";
const CREATE_PROJECT_CACHE_KEY = "wevo:projects:create-cache";
const CREATE_PROJECT_FALLBACK_ERROR_MESSAGE =
  "프로젝트 생성 요청에 실패했습니다.";

const readCreatedProjectCache = (): Record<
  string,
  CreateProjectResponseData
> => {
  const rawValue = localStorage.getItem(CREATE_PROJECT_CACHE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<
      string,
      CreateProjectResponseData
    >;

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
};

const writeCreatedProjectCache = (project: CreateProjectResponseData): void => {
  const cache = readCreatedProjectCache();
  cache[String(project.projectId)] = project;
  localStorage.setItem(CREATE_PROJECT_CACHE_KEY, JSON.stringify(cache));
};

export const getCachedCreatedProject = (
  projectId: number,
): CreateProjectResponseData | null => {
  const cache = readCreatedProjectCache();
  return cache[String(projectId)] ?? null;
};

export const createProject = async (
  payload: CreateProjectRequest,
): Promise<ApiResponse<CreateProjectResponseData>> => {
  const response = await apiClient.post<ApiResponse<CreateProjectResponseData>>(
    CREATE_PROJECT_PATH,
    payload,
  );

  writeCreatedProjectCache(response.data.data);
  return response.data;
};

export const getCreateProjectErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return CREATE_PROJECT_FALLBACK_ERROR_MESSAGE;
  }

  const responseData = error.response?.data as ApiResponse<unknown> | undefined;

  const reasons =
    responseData?.errors?.map((fieldError) => fieldError.reason) ?? [];

  if (reasons.length > 0) {
    return reasons.join(" ");
  }

  return responseData?.message ?? CREATE_PROJECT_FALLBACK_ERROR_MESSAGE;
};
