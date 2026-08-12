import { useQuery } from "@tanstack/react-query";
import { getSectionDraft } from "../api/getSectionDraft";

// DraftView의 초안 조회와 같은 키를 사용해 단계 전환 시 캐시를 재사용한다.
export const SECTION_DRAFT_QUERY_KEY = "workspace-draft-result";

/** 섹션의 최신 초안 본문을 조회한다. */
export const useSectionDraft = (sectionId: number) =>
  useQuery({
    queryKey: [SECTION_DRAFT_QUERY_KEY, sectionId],
    queryFn: () => getSectionDraft(sectionId),
  });
