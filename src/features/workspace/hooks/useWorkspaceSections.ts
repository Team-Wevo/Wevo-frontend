import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LIVE_SYNC_REFETCH_INTERVAL_MS } from "@/shared/constants/liveSync";
import { getWorkspaceSectionsByProjectId } from "../api/getWorkspaceSections";
import type { WorkspaceSection } from "../constants/sections";

export const WORKSPACE_SECTIONS_QUERY_KEY = "workspace-sections";

export const useWorkspaceSections = (
  projectId: number,
  initialData: WorkspaceSection[],
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(
      [WORKSPACE_SECTIONS_QUERY_KEY, projectId],
      initialData,
    );
  }, [initialData, projectId, queryClient]);

  return useQuery({
    queryKey: [WORKSPACE_SECTIONS_QUERY_KEY, projectId],
    queryFn: () => getWorkspaceSectionsByProjectId(projectId),
    initialData,
    refetchInterval: LIVE_SYNC_REFETCH_INTERVAL_MS,
  });
};
