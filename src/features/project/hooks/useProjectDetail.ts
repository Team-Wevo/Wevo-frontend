import { useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectDetail,
  type ProjectDetailResponse,
} from "../api/getProjectDetail";
import type { ProjectSummaryResponse } from "../api/projectList";
import {
  DEFAULT_PROJECT_TITLE,
  updateCachedCreatedProjectTitle,
} from "../api/projects";

export const PROJECT_DETAIL_QUERY_KEY = "project-detail";

const TITLE_POLL_INTERVAL_MS = 1_000;
const TITLE_POLL_TIMEOUT_MS = 30_000;

const isWaitingForGeneratedTitle = (title: string): boolean =>
  title.trim() === DEFAULT_PROJECT_TITLE;

export const useProjectDetail = (
  projectId: number,
  initialData: ProjectDetailResponse,
) => {
  const queryClient = useQueryClient();
  const pollingStartedAtRef = useRef<number | null>(null);
  const queryKey = useMemo(
    () => [PROJECT_DETAIL_QUERY_KEY, projectId] as const,
    [projectId],
  );
  const projectDetailQuery = useQuery({
    queryKey,
    queryFn: () => getProjectDetail(projectId),
    initialData,
    refetchInterval: (query) => {
      const project = query.state.data;

      if (!project || !isWaitingForGeneratedTitle(project.title)) {
        pollingStartedAtRef.current = null;
        return false;
      }

      pollingStartedAtRef.current ??= Date.now();

      return Date.now() - pollingStartedAtRef.current < TITLE_POLL_TIMEOUT_MS
        ? TITLE_POLL_INTERVAL_MS
        : false;
    },
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    pollingStartedAtRef.current = null;
    queryClient.setQueryData(queryKey, initialData);
  }, [initialData, queryClient, queryKey]);

  useEffect(() => {
    const title = projectDetailQuery.data?.title.trim();

    if (!title || isWaitingForGeneratedTitle(title)) {
      return;
    }

    updateCachedCreatedProjectTitle(projectId, title);
    queryClient.setQueriesData<ProjectSummaryResponse[]>(
      { queryKey: ["my-projects"] },
      (projects) =>
        projects?.map((project) =>
          project.projectId === projectId ? { ...project, title } : project,
        ),
    );
  }, [projectDetailQuery.data?.title, projectId, queryClient]);

  return projectDetailQuery;
};
