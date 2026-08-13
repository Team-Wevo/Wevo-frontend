import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LIVE_SYNC_REFETCH_INTERVAL_MS } from "@/shared/constants/liveSync";
import {
  getSectionOpinions,
  type SectionOpinionsResponse,
} from "../api/getSectionOpinions";

export const SECTION_OPINIONS_QUERY_KEY = "section-opinions";

export const useSectionOpinions = (
  sectionId: number,
  initialData: SectionOpinionsResponse | null,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(
      [SECTION_OPINIONS_QUERY_KEY, sectionId],
      initialData,
    );
  }, [initialData, queryClient, sectionId]);

  return useQuery({
    queryKey: [SECTION_OPINIONS_QUERY_KEY, sectionId],
    queryFn: () => getSectionOpinions(sectionId),
    initialData: initialData ?? undefined,
    refetchInterval: LIVE_SYNC_REFETCH_INTERVAL_MS,
  });
};
