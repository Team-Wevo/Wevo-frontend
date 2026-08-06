import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface OpinionAuthor {
  id: number;
  name: string;
  profileImageUrl: string;
}

export interface SectionOpinion {
  id: number;
  author: OpinionAuthor;
  content: string;
  submittedAt: string;
}

export interface SectionOpinionsResponse {
  everSubmitted: boolean;
  totalSubmittedCount: number;
  opinions: SectionOpinion[];
}

const GET_SECTION_OPINIONS_FALLBACK_MESSAGE =
  "제출된 의견을 불러오지 못했습니다.";

/**
 * 제출된 팀원 의견 목록을 조회한다. 공개 게이트가 있어, 본인이 아직
 * 의견을 제출하지 않았다면 서버가 목록 대신 건수만 내려줄 수 있다.
 */
export const getSectionOpinions = async (
  sectionId: number,
): Promise<SectionOpinionsResponse> => {
  const response = await apiClient.get<ApiResponse<SectionOpinionsResponse>>(
    `/api/project-sections/${sectionId}/opinions`,
  );

  return unwrapApiResponse(response.data);
};

export const getSectionOpinionsErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, GET_SECTION_OPINIONS_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
