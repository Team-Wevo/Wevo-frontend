import { useQuery } from "@tanstack/react-query";
import { LIVE_SYNC_REFETCH_INTERVAL_MS } from "@/shared/constants/liveSync";
import { getProjectMembers } from "../api/getProjectMembers";

export const PROJECT_MEMBERS_QUERY_KEY = "project-members";

interface UseProjectMembersOptions {
  enabled?: boolean;
  live?: boolean;
}

export const useProjectMembers = (
  projectId: number,
  { enabled = true, live = false }: UseProjectMembersOptions = {},
) => {
  const isEnabled = enabled && Number.isInteger(projectId) && projectId > 0;

  return useQuery({
    queryKey: [PROJECT_MEMBERS_QUERY_KEY, projectId],
    queryFn: () => getProjectMembers(projectId),
    enabled: isEnabled,
    refetchInterval: isEnabled && live ? LIVE_SYNC_REFETCH_INTERVAL_MS : false,
  });
};
