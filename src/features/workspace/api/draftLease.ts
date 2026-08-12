import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

interface DraftEditorSummary {
  userId: number;
  name: string;
}

interface DraftLeaseBaseResponse {
  expiresAt: string;
}

export interface DraftLeaseStatusResponse {
  locked: boolean;
  editor: DraftEditorSummary | null;
  expiresAt: string | null;
}

const ACQUIRE_LEASE_FALLBACK_MESSAGE = "편집권 획득에 실패했습니다.";
const REFRESH_LEASE_FALLBACK_MESSAGE = "편집권 연장에 실패했습니다.";
const RELEASE_LEASE_FALLBACK_MESSAGE = "편집권 해제에 실패했습니다.";
const GET_LEASE_STATUS_FALLBACK_MESSAGE = "편집 상태를 불러오지 못했습니다.";

export const acquireSectionDraftLease = async (
  sectionId: number,
): Promise<DraftLeaseBaseResponse> => {
  const response = await apiClient.post<ApiResponse<DraftLeaseBaseResponse>>(
    `/api/project-sections/${sectionId}/draft/lease`,
  );

  return unwrapApiResponse(response.data);
};

export const refreshSectionDraftLease = async (
  sectionId: number,
): Promise<DraftLeaseBaseResponse> => {
  const response = await apiClient.put<ApiResponse<DraftLeaseBaseResponse>>(
    `/api/project-sections/${sectionId}/draft/lease`,
  );

  return unwrapApiResponse(response.data);
};

export const releaseSectionDraftLease = async (sectionId: number) => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/api/project-sections/${sectionId}/draft/lease`,
  );

  return unwrapApiResponse(response.data);
};

export const getSectionDraftLeaseStatus = async (
  sectionId: number,
): Promise<DraftLeaseStatusResponse> => {
  const response = await apiClient.get<ApiResponse<DraftLeaseStatusResponse>>(
    `/api/project-sections/${sectionId}/draft/lease`,
  );

  return unwrapApiResponse(response.data);
};

export const getAcquireDraftLeaseErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, ACQUIRE_LEASE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};

export const getRefreshDraftLeaseErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, REFRESH_LEASE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};

export const getReleaseDraftLeaseErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, RELEASE_LEASE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};

export const getDraftLeaseStatusErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GET_LEASE_STATUS_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
