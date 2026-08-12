import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRevalidator } from "react-router-dom";
import AiDraftProgressCard from "../blocks/AiDraftProgressCard";
import DraftEditedView from "../draft/DraftEditedView";
import DraftEditingView from "../draft/DraftEditingView";
import DraftGeneratedView from "../draft/DraftGeneratedView";
import DraftGeneratingView from "../draft/DraftGeneratingView";
import {
  MOCK_ANALYSIS_TASK_STEPS,
  MOCK_DRAFT_STATE_BY_STAGE,
} from "../draft/mock";
import DraftReviewableView from "../draft/DraftReviewableView";
import IssueCoordinationView from "../issue/IssueCoordinationView";
import type {
  DraftStage,
  DraftStageViewProps,
  DebugDraftStage,
} from "../draft/types";
import type { IssueCoordinationData, WorkspaceIssue } from "../issue/types";
import type { WorkspaceSection } from "../../constants/sections";
import { getAiJobStatus } from "../../api/getAiJobStatus";
import {
  generateSectionDraft,
  getGenerateDraftErrorMessage,
} from "../../api/generateDraft";
import {
  getSectionDraft,
  getSectionDraftErrorMessage,
  type SectionDraftResponse,
} from "../../api/getSectionDraft";
import {
  getSectionSynthesis,
  getSectionSynthesisErrorMessage,
  type SectionSynthesisCurrentSetResponse,
} from "../../api/getSectionSynthesis";
import {
  requestReview,
  getRequestReviewErrorMessage,
} from "../../api/requestReview";
import {
  getStartSynthesisErrorMessage,
  startSectionSynthesis,
} from "../../api/startSynthesis";
import {
  getStoredDraftRequestId,
  getStoredSynthesisRequestId,
  setStoredDraftRequestId,
  setStoredSynthesisRequestId,
} from "../../utils/aiJobRequestStorage";

interface DraftViewProps {
  section: WorkspaceSection;
}

const AI_JOB_POLLING_INTERVAL_MS = 5_000;

const toStringValue = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
};

const toRecordValue = (value: unknown): Record<string, unknown> | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  return value as Record<string, unknown>;
};

const hasIssuePayloadShape = (value: unknown): boolean => {
  const record = toRecordValue(value);

  if (!record) {
    return false;
  }

  return (
    Array.isArray(record.issues) ||
    Array.isArray(record.issueList) ||
    Array.isArray(record.currentSet) ||
    typeof record.consensusSummary === "string" ||
    typeof record.summary === "string"
  );
};

const extractSynthesisCurrentSet = (
  responseData: unknown,
): SectionSynthesisCurrentSetResponse | null => {
  const root = toRecordValue(responseData);

  if (!root) {
    return null;
  }

  const directCandidates: unknown[] = [
    root.currentSet,
    root.current_set,
    root.result,
    root.data,
  ];

  for (const candidate of directCandidates) {
    if (hasIssuePayloadShape(candidate)) {
      return candidate as SectionSynthesisCurrentSetResponse;
    }

    const candidateRecord = toRecordValue(candidate);

    if (!candidateRecord) {
      continue;
    }

    const nestedCandidate =
      candidateRecord.currentSet ?? candidateRecord.current_set;

    if (hasIssuePayloadShape(nestedCandidate)) {
      return nestedCandidate as SectionSynthesisCurrentSetResponse;
    }
  }

  return hasIssuePayloadShape(root)
    ? (root as SectionSynthesisCurrentSetResponse)
    : null;
};

const extractSynthesisLatestJob = (
  responseData: unknown,
): { requestId: string | null; status: string | null } | null => {
  const record = toRecordValue(responseData);

  if (!record) {
    return null;
  }

  const latestJobRecord = toRecordValue(record.latestJob);

  if (!latestJobRecord) {
    return null;
  }

  return {
    requestId: toStringValue(latestJobRecord.requestId),
    status: toStringValue(latestJobRecord.status),
  };
};

const normalizeSynthesisJobStatus = (
  status: string | null,
): "REQUESTED" | "SUCCEEDED" | "FAILED" | null => {
  if (!status) {
    return null;
  }

  const normalized = status.trim().toUpperCase();

  if (
    normalized === "SUCCEEDED" ||
    normalized === "SUCCESS" ||
    normalized === "COMPLETED" ||
    normalized === "DONE"
  ) {
    return "SUCCEEDED";
  }

  if (
    normalized === "FAILED" ||
    normalized === "ERROR" ||
    normalized === "CANCELLED" ||
    normalized === "CANCELED"
  ) {
    return "FAILED";
  }

  return "REQUESTED";
};

const toIssueType = (value: unknown): "CONFLICT" | "GAP" | "UNKNOWN" => {
  if (typeof value !== "string") {
    return "UNKNOWN";
  }

  const normalized = value.trim().toUpperCase();

  if (normalized === "CONFLICT") {
    return "CONFLICT";
  }

  if (normalized === "GAP") {
    return "GAP";
  }

  return "UNKNOWN";
};

const toWorkspaceIssue = (
  issue: Record<string, unknown>,
  index: number,
): WorkspaceIssue => {
  const issueType = toIssueType(issue.type ?? issue.issueType);

  const optionCandidates = Array.isArray(issue.options)
    ? issue.options
    : Array.isArray(issue.decisionOptions)
      ? issue.decisionOptions
      : [];

  const options = optionCandidates
    .map((option, optionIndex) => {
      if (typeof option !== "object" || option === null) {
        return null;
      }

      const record = option as Record<string, unknown>;
      const label =
        toStringValue(record.label) ??
        toStringValue(record.content) ??
        toStringValue(record.text);

      if (!label) {
        return null;
      }

      const optionId =
        toStringValue(record.id) ??
        toStringValue(record.optionId) ??
        `${index + 1}-option-${optionIndex + 1}`;

      return {
        id: optionId,
        label,
        isCustomInput: Boolean(record.isCustomInput),
      };
    })
    .filter((option): option is NonNullable<typeof option> => option !== null);

  const opinionCandidates = Array.isArray(issue.opinions)
    ? issue.opinions
    : Array.isArray(issue.relatedOpinions)
      ? issue.relatedOpinions
      : [];
  const opinions = opinionCandidates
    .map((opinion) => {
      if (typeof opinion !== "object" || opinion === null) {
        return null;
      }

      const record = opinion as Record<string, unknown>;
      const memberName =
        toStringValue(record.memberName) ??
        toStringValue(record.name) ??
        toStringValue(record.authorName);
      const content =
        toStringValue(record.content) ??
        toStringValue(record.opinion) ??
        toStringValue(record.text) ??
        toStringValue(record.excerpt);

      if (!memberName || !content) {
        return null;
      }

      return { memberName, content };
    })
    .filter(
      (opinion): opinion is NonNullable<typeof opinion> => opinion !== null,
    );

  const title =
    toStringValue(issue.title) ??
    toStringValue(issue.description) ??
    toStringValue(issue.summary) ??
    toStringValue(issue.content) ??
    `${index + 1}번 쟁점`;

  const aiHint =
    toStringValue(issue.aiHint) ??
    toStringValue(issue.question) ??
    (issueType === "GAP"
      ? "추가 근거를 요청한 상태예요. 답변을 기다리며 진행할 수 있어요."
      : "이 쟁점의 방향을 하나로 결정해 주세요.");

  if (issueType === "GAP") {
    return {
      id:
        toStringValue(issue.id) ??
        toStringValue(issue.issueId) ??
        `gap-${index + 1}`,
      order: index + 1,
      title,
      resolutionType: "evidence-request",
      aiHint,
      opinions,
      evidenceRequest: {
        message:
          toStringValue(issue.requestMessage) ??
          "추가 근거를 요청했어요 · 답변 대기",
        questionCount:
          typeof issue.questionCount === "number" && issue.questionCount > 0
            ? issue.questionCount
            : 1,
      },
    };
  }

  const choiceOptions =
    options.length > 0
      ? options
      : [
          { id: `${index + 1}-agree`, label: "의견 A 기준으로 반영" },
          { id: `${index + 1}-merge`, label: "의견을 통합해 반영" },
          {
            id: `${index + 1}-custom`,
            label: "직접 입력",
            isCustomInput: true,
          },
        ];

  return {
    id:
      toStringValue(issue.id) ??
      toStringValue(issue.issueId) ??
      `conflict-${index + 1}`,
    order: index + 1,
    title,
    resolutionType: "choice",
    aiHint,
    opinions,
    options: choiceOptions,
  };
};

const toIssueCoordinationData = (
  currentSet: SectionSynthesisCurrentSetResponse | null,
): IssueCoordinationData => {
  const currentSetRecord = (currentSet ?? {}) as Record<string, unknown>;
  const issuesCandidate =
    currentSetRecord.issues ??
    currentSetRecord.issueList ??
    currentSetRecord.currentSet;
  const issuesSource = Array.isArray(issuesCandidate) ? issuesCandidate : [];
  const issues = issuesSource
    .filter((issue): issue is Record<string, unknown> => {
      return typeof issue === "object" && issue !== null;
    })
    .map(toWorkspaceIssue);

  const consensusSummary =
    toStringValue(currentSetRecord.consensusSummary) ??
    toStringValue(currentSetRecord.summary) ??
    "팀 의견 정리가 완료되었어요. 아래 쟁점을 확인해 주세요.";

  return {
    sharedProblem: {
      summary: consensusSummary,
      issueStatement:
        issues.length > 0
          ? "쟁점을 확인하고 필요한 결정을 완료해 주세요."
          : "현재 결정이 필요한 쟁점이 없어요.",
    },
    issues,
  };
};

const buildEditingStateFromDraft = (
  draft: SectionDraftResponse,
): (typeof MOCK_DRAFT_STATE_BY_STAGE)["editing"] => {
  const activityLabel = draft.activeEditor
    ? `${draft.activeEditor.name} 님 편집 중`
    : "편집 가능";

  return {
    ...MOCK_DRAFT_STATE_BY_STAGE.editing,
    version: draft.contentVersion,
    draftContent: draft.content,
    activity: {
      label: activityLabel,
      tone: "success",
    },
    editingMeta: {
      currentEditorName: draft.activeEditor?.name ?? "팀원",
      myDisplayName: "내",
      defaultMode: "self",
    },
  };
};

const getAiJobFailedMessage = (featureLabel: string) => {
  return `${featureLabel} 작업이 실패했습니다. 잠시 후 다시 시도해 주세요.`;
};

const DRAFT_STAGE_VIEW_COMPONENTS: Record<
  DraftStage,
  ComponentType<DraftStageViewProps>
> = {
  generating: DraftGeneratingView,
  generated: DraftGeneratedView,
  editing: DraftEditingView,
  edited: DraftEditedView,
  reviewable: DraftReviewableView,
};

const getInitialStage = (
  sectionStatus: WorkspaceSection["sectionStatus"],
  hasSynthesisRequestId: boolean,
  hasDraftRequestId: boolean,
): DebugDraftStage => {
  if (hasDraftRequestId) {
    return "generating";
  }

  if (hasSynthesisRequestId || sectionStatus === "SYNTHESIZING") {
    return "opinion-analyzing";
  }

  return "issue-coordination";
};

const DraftView = ({ section }: DraftViewProps) => {
  const sectionId = section.projectSectionId;
  const revalidator = useRevalidator();

  const initialSynthesisRequestId = getStoredSynthesisRequestId(sectionId);
  const initialDraftRequestId = getStoredDraftRequestId(sectionId);

  const [draftStage, setDraftStage] = useState<DebugDraftStage>(() =>
    getInitialStage(
      section.sectionStatus,
      Boolean(initialSynthesisRequestId),
      Boolean(initialDraftRequestId),
    ),
  );
  const [synthesisRequestId, setSynthesisRequestId] = useState<string | null>(
    initialSynthesisRequestId,
  );
  const [draftRequestId, setDraftRequestId] = useState<string | null>(
    initialDraftRequestId,
  );
  const [isMovingToReviewRequest, setIsMovingToReviewRequest] = useState(false);
  const [moveToReviewRequestErrorMessage, setMoveToReviewRequestErrorMessage] =
    useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(
    null,
  );
  const [isStartingDraftGeneration, setIsStartingDraftGeneration] =
    useState(false);

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      '[data-workspace-scroll-container="true"]',
    );

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollTo({ top: 0 });
  }, [draftStage]);

  const synthesisStartQuery = useQuery({
    queryKey: ["workspace-start-synthesis", sectionId],
    queryFn: async () => {
      const result = await startSectionSynthesis(sectionId);
      setStoredSynthesisRequestId(sectionId, result.requestId);
      setSynthesisRequestId(result.requestId);
      return result;
    },
    enabled: section.sectionStatus === "SYNTHESIZING" && !synthesisRequestId,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const shouldRunSynthesisSnapshot =
    section.sectionStatus === "SYNTHESIZING" &&
    !synthesisRequestId &&
    !synthesisStartQuery.isFetching &&
    !synthesisStartQuery.data?.requestId;

  const synthesisSnapshotQuery = useQuery({
    queryKey: ["workspace-synthesis-snapshot", sectionId],
    queryFn: () => getSectionSynthesis(sectionId),
    enabled: shouldRunSynthesisSnapshot,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const synthesisLatestJobFromSnapshot = useMemo(() => {
    return extractSynthesisLatestJob(synthesisSnapshotQuery.data);
  }, [synthesisSnapshotQuery.data]);

  const effectiveSynthesisRequestId =
    synthesisStartQuery.data?.requestId ??
    synthesisLatestJobFromSnapshot?.requestId ??
    synthesisRequestId ??
    null;

  const synthesisJobQuery = useQuery({
    queryKey: [
      "workspace-ai-job",
      "synthesis",
      sectionId,
      effectiveSynthesisRequestId,
    ],
    queryFn: () => getAiJobStatus(effectiveSynthesisRequestId as string),
    enabled: Boolean(effectiveSynthesisRequestId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return !status || status === "REQUESTED"
        ? AI_JOB_POLLING_INTERVAL_MS
        : false;
    },
  });

  const synthesisJobStatus =
    synthesisJobQuery.data?.status ??
    normalizeSynthesisJobStatus(
      synthesisLatestJobFromSnapshot?.status ?? null,
    ) ??
    "REQUESTED";
  const synthesisFailureMessage =
    synthesisJobQuery.data?.failure?.message?.trim() ?? null;

  const synthesisResultQuery = useQuery({
    queryKey: [
      "workspace-synthesis-result",
      sectionId,
      effectiveSynthesisRequestId,
      synthesisJobStatus,
    ],
    queryFn: () => getSectionSynthesis(sectionId),
    enabled:
      section.sectionStatus === "DRAFTING" ||
      synthesisJobStatus === "SUCCEEDED",
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!effectiveSynthesisRequestId) {
      return;
    }

    setStoredSynthesisRequestId(sectionId, effectiveSynthesisRequestId);
  }, [sectionId, effectiveSynthesisRequestId]);

  const synthesisCurrentSet = useMemo(() => {
    const resultPayload = extractSynthesisCurrentSet(synthesisResultQuery.data);

    if (resultPayload) {
      return resultPayload;
    }

    return extractSynthesisCurrentSet(synthesisSnapshotQuery.data);
  }, [synthesisResultQuery.data, synthesisSnapshotQuery.data]);

  const issueCoordinationData = useMemo(() => {
    return synthesisCurrentSet
      ? toIssueCoordinationData(synthesisCurrentSet)
      : null;
  }, [synthesisCurrentSet]);

  const draftJobQuery = useQuery({
    queryKey: ["workspace-ai-job", "draft", sectionId, draftRequestId],
    queryFn: () => getAiJobStatus(draftRequestId as string),
    enabled: Boolean(draftRequestId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return !status || status === "REQUESTED"
        ? AI_JOB_POLLING_INTERVAL_MS
        : false;
    },
  });

  const isDraftJobFeatureMismatch = Boolean(
    draftJobQuery.data?.feature &&
    draftJobQuery.data.feature !== "DRAFT_GENERATION",
  );

  const draftResultQuery = useQuery({
    queryKey: ["workspace-draft-result", sectionId],
    queryFn: () => getSectionDraft(sectionId),
    enabled:
      draftJobQuery.data?.status === "SUCCEEDED" && !isDraftJobFeatureMismatch,
    retry: false,
  });

  const runtimeDraftState = useMemo(() => {
    if (!draftResultQuery.data) {
      return null;
    }

    return buildEditingStateFromDraft(draftResultQuery.data);
  }, [draftResultQuery.data]);

  const resolvedStage = useMemo<DebugDraftStage>(() => {
    if (runtimeDraftState) {
      if (draftStage === "reviewable" || draftStage === "edited") {
        return draftStage;
      }

      return "editing";
    }

    if (draftRequestId || draftJobQuery.data?.status === "REQUESTED") {
      return "generating";
    }

    if (issueCoordinationData) {
      return "issue-coordination";
    }

    if (synthesisJobStatus === "SUCCEEDED") {
      return "issue-coordination";
    }

    return "opinion-analyzing";
  }, [
    runtimeDraftState,
    draftStage,
    draftRequestId,
    draftJobQuery.data,
    synthesisJobStatus,
    issueCoordinationData,
  ]);

  const flowErrorMessage = useMemo(() => {
    if (actionErrorMessage) {
      return actionErrorMessage;
    }

    if (synthesisStartQuery.isError) {
      return getStartSynthesisErrorMessage(synthesisStartQuery.error);
    }

    if (synthesisSnapshotQuery.isError) {
      return getSectionSynthesisErrorMessage(synthesisSnapshotQuery.error);
    }

    if (synthesisJobStatus === "FAILED") {
      if (synthesisFailureMessage) {
        return synthesisFailureMessage;
      }

      return getAiJobFailedMessage("AI 의견 정리");
    }

    if (
      synthesisResultQuery.isError &&
      (synthesisJobStatus === "SUCCEEDED" ||
        section.sectionStatus === "DRAFTING")
    ) {
      return getSectionSynthesisErrorMessage(synthesisResultQuery.error);
    }

    if (draftJobQuery.data?.status === "FAILED") {
      return getAiJobFailedMessage("초안 생성");
    }

    if (isDraftJobFeatureMismatch) {
      return "초안 생성 작업 타입을 확인할 수 없습니다.";
    }

    if (draftResultQuery.isError) {
      return getSectionDraftErrorMessage(draftResultQuery.error);
    }

    return null;
  }, [
    actionErrorMessage,
    synthesisStartQuery.isError,
    synthesisStartQuery.error,
    synthesisSnapshotQuery.isError,
    synthesisSnapshotQuery.error,
    synthesisJobStatus,
    synthesisFailureMessage,
    section.sectionStatus,
    synthesisResultQuery.isError,
    synthesisResultQuery.error,
    draftJobQuery.data,
    isDraftJobFeatureMismatch,
    draftResultQuery.isError,
    draftResultQuery.error,
  ]);

  const handleOpenEvidence = () => {
    // TODO: 근거 상세 패널/모달 연결
  };

  const handleRequestReadabilityCheck = () => {
    setDraftStage("reviewable");
  };

  const handleMoveToEditing = () => {
    setDraftStage("editing");
  };

  const handleFinishEditing = () => {
    setDraftStage("edited");
  };

  const handleMoveToReviewRequest = async () => {
    setIsMovingToReviewRequest(true);
    setMoveToReviewRequestErrorMessage(null);

    try {
      await requestReview(section.projectSectionId);
      await revalidator.revalidate();
    } catch (error) {
      setMoveToReviewRequestErrorMessage(getRequestReviewErrorMessage(error));
    } finally {
      setIsMovingToReviewRequest(false);
    }
  };

  const handleCreateDraft = async () => {
    setIsStartingDraftGeneration(true);
    setActionErrorMessage(null);

    try {
      const { requestId } = await generateSectionDraft(sectionId);
      setStoredDraftRequestId(sectionId, requestId);
      setDraftRequestId(requestId);
      setDraftStage("generating");
    } catch (error) {
      setActionErrorMessage(getGenerateDraftErrorMessage(error));
    } finally {
      setIsStartingDraftGeneration(false);
    }
  };

  const isOpinionAnalyzingStage = resolvedStage === "opinion-analyzing";
  const isIssueCoordinationStage = resolvedStage === "issue-coordination";

  return (
    <div
      aria-label={`${section.orderNo}. ${section.title} 초안 작성 상태`}
      className="flex w-full flex-col gap-6"
    >
      {flowErrorMessage && (
        <div className="flex items-center justify-between gap-3 rounded-sm border border-red-200 bg-red-50 px-3 py-2">
          <div className="text-error text-xs leading-4 font-normal">
            {flowErrorMessage}
          </div>
          {synthesisStartQuery.isError && !effectiveSynthesisRequestId && (
            <button
              type="button"
              onClick={() => void synthesisStartQuery.refetch()}
              className="text-error shrink-0 text-xs leading-4 font-medium underline"
            >
              다시 시도
            </button>
          )}
        </div>
      )}

      {isOpinionAnalyzingStage ? (
        <AiDraftProgressCard
          participantCount={3}
          steps={MOCK_ANALYSIS_TASK_STEPS}
          notice="의견 수에 따라 잠시 시간이 걸릴 수 있어요."
        />
      ) : isIssueCoordinationStage ? (
        <IssueCoordinationView
          data={issueCoordinationData ?? toIssueCoordinationData(null)}
          onCreateDraft={handleCreateDraft}
          isCreatingDraft={isStartingDraftGeneration}
        />
      ) : (
        (() => {
          const currentDraftState =
            runtimeDraftState ??
            MOCK_DRAFT_STATE_BY_STAGE[resolvedStage as DraftStage];
          const CurrentDraftStageView =
            DRAFT_STAGE_VIEW_COMPONENTS[currentDraftState.stage];

          return (
            <CurrentDraftStageView
              state={currentDraftState}
              onEditDraft={handleMoveToEditing}
              onOpenEvidence={handleOpenEvidence}
              onRequestReadabilityCheck={handleRequestReadabilityCheck}
              onFinishEditing={handleFinishEditing}
              onMoveToReviewRequest={handleMoveToReviewRequest}
              isMovingToReviewRequest={isMovingToReviewRequest}
              moveToReviewRequestErrorMessage={moveToReviewRequestErrorMessage}
            />
          );
        })()
      )}
    </div>
  );
};

export default DraftView;
