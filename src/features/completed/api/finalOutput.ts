import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";
import type { ProjectResultType } from "../../project/api/projectList";

export interface FinalOutputSection {
  order: number;
  title: string;
  content: string;
}

export interface FinalOutputResponse {
  projectId: number;
  title: string;
  resultType: ProjectResultType;
  ready: boolean;
  confirmedCount: number;
  totalCount: number;
  sections?: FinalOutputSection[];
}

interface FinalOutputContentResponse {
  content: string;
}

export type FinalOutputFormat = "plain-text" | "markdown";

export const getFinalOutput = async (
  projectId: number,
): Promise<FinalOutputResponse> => {
  const response = await apiClient.get<ApiResponse<FinalOutputResponse>>(
    `/api/projects/${projectId}/final-output`,
  );

  return unwrapApiResponse(response.data);
};

export const getFinalOutputContent = async (
  projectId: number,
  format: FinalOutputFormat,
): Promise<string> => {
  const response = await apiClient.get<ApiResponse<FinalOutputContentResponse>>(
    `/api/projects/${projectId}/final-output/${format}`,
  );

  return unwrapApiResponse(response.data).content;
};

export const downloadFinalOutput = async (
  projectId: number,
  format: FinalOutputFormat,
  fileName: string,
): Promise<Blob> => {
  const response = await apiClient.get<Blob>(
    `/api/projects/${projectId}/final-output/download/${format}`,
    {
      params: { fileName },
      responseType: "blob",
    },
  );

  return response.data;
};

export const getFinalOutputErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, "완성본을 불러오지 못했습니다.", {
    includeCode: true,
  });
