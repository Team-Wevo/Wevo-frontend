import { apiClient } from "../../../shared/api/client";
import { getApiErrorMessage } from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface DraftEvidenceOpinion {
  opinionId: number;
  authorName: string;
  content: string;
}

export interface DraftEvidenceDecision {
  issueId: number;
  question: string;
  decision: string;
}

export interface DraftEvidenceGapAnswer {
  issueId: number;
  answerId: number;
  authorName: string;
  content: string;
  answeredAt: string;
  inherited: boolean;
}

export interface SectionDraftEvidenceResponse {
  consensusSummary?: string | null;
  opinions: DraftEvidenceOpinion[];
  decisions: DraftEvidenceDecision[];
  gapAnswers: DraftEvidenceGapAnswer[];
}

const GET_DRAFT_EVIDENCE_FALLBACK_MESSAGE =
  "초안의 근거를 불러오지 못했습니다.";

export const getSectionDraftEvidence = async (
  sectionId: number,
): Promise<SectionDraftEvidenceResponse> => {
  const response = await apiClient.get<
    ApiResponse<SectionDraftEvidenceResponse>
  >(`/api/project-sections/${sectionId}/draft/evidence`);

  return unwrapApiResponse(response.data);
};

export const getSectionDraftEvidenceErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, GET_DRAFT_EVIDENCE_FALLBACK_MESSAGE, {
    includeCode: true,
  });
