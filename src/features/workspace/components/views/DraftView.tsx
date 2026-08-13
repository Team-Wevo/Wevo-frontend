import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRevalidator } from "react-router-dom";
import { useMyProfile } from "../../../auth/hooks/useMyProfile";
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
  AiPreReviewData,
  AiPreReviewResultType,
  DraftStage,
  DraftStageViewProps,
  DebugDraftStage,
} from "../draft/types";
import type {
  IssueCoordinationData,
  IssueDecisionSubmission,
  WorkspaceIssue,
} from "../issue/types";
import type { WorkspaceSection } from "../../constants/sections";
import { getAiJobStatus } from "../../api/getAiJobStatus";
import {
  applySectionDraftPrecheck,
  getApplySectionDraftPrecheckErrorMessage,
} from "../../api/applySectionDraftPrecheck";
import {
  acquireSectionDraftLease,
  getAcquireDraftLeaseErrorMessage,
  getDraftLeaseStatusErrorMessage,
  getReleaseDraftLeaseErrorMessage,
  getRefreshDraftLeaseErrorMessage,
  getSectionDraftLeaseStatus,
  releaseSectionDraftLease,
  refreshSectionDraftLease,
} from "../../api/draftLease";
import {
  generateSectionDraft,
  getGenerateDraftErrorMessage,
} from "../../api/generateDraft";
import { answerIssue, getAnswerIssueErrorMessage } from "../../api/answerIssue";
import {
  getRequestIssueEvidenceErrorMessage,
  requestIssueEvidence,
} from "../../api/requestIssueEvidence";
import { decideIssue, getDecideIssueErrorMessage } from "../../api/decideIssue";
import {
  getSectionDraft,
  getSectionDraftErrorMessage,
  type SectionDraftResponse,
} from "../../api/getSectionDraft";
import {
  getSectionDraftPrecheck,
  type SectionDraftPrecheckCurrentResult,
  type SectionDraftPrecheckFinding,
} from "../../api/getSectionDraftPrecheck";
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
import { LIVE_SYNC_REFETCH_INTERVAL_MS } from "../../../../shared/constants/liveSync";
import { getApiErrorResponse } from "../../../../shared/api/error";
import {
  getRequestSectionDraftPrecheckErrorMessage,
  requestSectionDraftPrecheck,
} from "../../api/requestDraftPrecheck";
import {
  getSaveSectionDraftErrorMessage,
  saveSectionDraft,
} from "../../api/saveSectionDraft";
import {
  clearStoredDraftRequestId,
  clearStoredPrecheckRequestId,
  getStoredDraftRequestId,
  getStoredPrecheckRequestId,
  getStoredSynthesisRequestId,
  setStoredPrecheckRequestId,
  setStoredDraftRequestId,
  setStoredSynthesisRequestId,
} from "../../utils/aiJobRequestStorage";
import type { WorkspacePermissions } from "../../utils/getWorkspacePermissions";
interface DraftViewProps {
  section: WorkspaceSection;
  permissions: WorkspacePermissions;
}

const isDraftLeaseNoLongerOwnedError = (error: unknown) => {
  const code = getApiErrorResponse(error)?.code;

  return code === "S004" || code === "S005";
};

const AI_JOB_POLLING_INTERVAL_MS = 5_000;
const DRAFT_LEASE_HEARTBEAT_BUFFER_MS = 60_000;
const DRAFT_LEASE_HEARTBEAT_MIN_INTERVAL_MS = 30_000;

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
    ? (root as unknown as SectionSynthesisCurrentSetResponse)
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
      if (typeof option === "string") {
        const label = option.trim();

        if (!label) {
          return null;
        }

        return {
          id: `${index + 1}-option-${optionIndex + 1}`,
          label,
          isCustomInput: label.replace(/\s/g, "") === "직접입력",
        };
      }

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

      const authorUserId =
        typeof record.authorUserId === "number"
          ? record.authorUserId
          : undefined;

      return { authorUserId, memberName, content };
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
  const decisionRecord = toRecordValue(issue.decision);
  const decision = decisionRecord
    ? {
        selectedOption:
          toStringValue(decisionRecord.selectedOption) ?? undefined,
        customInput: toStringValue(decisionRecord.customInput) ?? undefined,
      }
    : undefined;

  if (issueType === "GAP") {
    const answerRecord = toRecordValue(issue.answer);
    const answer = answerRecord
      ? {
          authorName: toStringValue(answerRecord.authorName) ?? "팀원",
          content: toStringValue(answerRecord.content) ?? "",
          answeredAt: toStringValue(answerRecord.answeredAt) ?? "",
        }
      : undefined;
    const evidenceRequested = issue.evidenceRequested === true;

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
        requested: evidenceRequested,
        message:
          toStringValue(issue.requestMessage) ??
          (answer
            ? "추가 근거 답변이 등록되었어요."
            : evidenceRequested
              ? "추가 근거를 요청한 상태예요 · 답변 대기"
              : "추가 근거 요청이 필요해요."),
        questionCount:
          typeof issue.questionCount === "number" && issue.questionCount > 0
            ? issue.questionCount
            : 1,
        answer,
      },
      decision,
    };
  }

  const choiceOptions = options.some((option) => option.isCustomInput)
    ? options
    : [
        ...options,
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
    decision,
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
  options: {
    isLockedByAnotherEditor: boolean;
    editorName: string | null;
    myDisplayName: string;
  },
): (typeof MOCK_DRAFT_STATE_BY_STAGE)["editing"] => {
  const activityLabel = options.isLockedByAnotherEditor
    ? `${options.editorName ?? "팀원"} 님 편집 중`
    : `${options.myDisplayName}가 편집 중`;

  return {
    ...MOCK_DRAFT_STATE_BY_STAGE.editing,
    version: draft.contentVersion,
    draftContent: draft.content,
    activity: {
      label: activityLabel,
      tone: "success",
    },
    editingMeta: {
      currentEditorName:
        options.editorName ?? draft.activeEditor?.name ?? "팀원",
      myDisplayName: options.myDisplayName,
      defaultMode: options.isLockedByAnotherEditor ? "locked" : "self",
    },
  };
};

const buildGeneratedStateFromDraft = (
  draft: SectionDraftResponse,
  isLockedByAnotherEditor: boolean,
  editorName: string | null,
): (typeof MOCK_DRAFT_STATE_BY_STAGE)["generated"] => {
  return {
    ...MOCK_DRAFT_STATE_BY_STAGE.generated,
    version: draft.contentVersion,
    draftContent: draft.content,
    activity: {
      label: isLockedByAnotherEditor
        ? `${editorName ?? "팀원"} 님 편집 중`
        : "초안 생성 완료",
      tone: "success",
    },
  };
};

const buildEditedStateFromDraft = (
  draft: SectionDraftResponse,
): (typeof MOCK_DRAFT_STATE_BY_STAGE)["edited"] => {
  return {
    ...MOCK_DRAFT_STATE_BY_STAGE.edited,
    version: draft.contentVersion,
    draftContent: draft.content,
  };
};

const buildReviewableStateFromDraft = (
  draft: SectionDraftResponse,
  preReview?: AiPreReviewData,
): (typeof MOCK_DRAFT_STATE_BY_STAGE)["reviewable"] => {
  return {
    ...MOCK_DRAFT_STATE_BY_STAGE.reviewable,
    version: draft.contentVersion,
    draftContent: draft.content,
    preReview,
  };
};

const PRECHECK_RESULT_TYPE_MAP: Record<string, AiPreReviewResultType> = {
  UNCLEAR_SENTENCE: "blocked_sentence",
  BLOCKED_SENTENCE: "blocked_sentence",
  HIDDEN_ASSUMPTION: "hidden_assumption",
  READER_QUESTION: "reader_question",
};

const PRECHECK_RESULT_TITLE_MAP: Record<AiPreReviewResultType, string> = {
  blocked_sentence: "막히는 문장",
  hidden_assumption: "숨은 전제",
  reader_question: "독자 질문",
};

const PRECHECK_RESULT_TYPE_ORDER: AiPreReviewResultType[] = [
  "blocked_sentence",
  "hidden_assumption",
  "reader_question",
];

const toPreReviewResultType = (value: string): AiPreReviewResultType => {
  return (
    PRECHECK_RESULT_TYPE_MAP[value.trim().toUpperCase()] ?? "blocked_sentence"
  );
};

const toPreReviewResult = (
  finding: SectionDraftPrecheckFinding,
  index: number,
) => {
  const type = toPreReviewResultType(finding.type);
  const description = finding.targetExcerpt?.trim()
    ? `"${finding.targetExcerpt}" ${finding.comment}`
    : finding.comment;

  return {
    id: `${type}-${index + 1}`,
    type,
    title: PRECHECK_RESULT_TITLE_MAP[type],
    findings: [
      {
        description,
        suggestion: finding.suggestion,
      },
    ],
  };
};

const toPreReviewData = (
  result: SectionDraftPrecheckCurrentResult | undefined,
): AiPreReviewData | undefined => {
  if (!result) {
    return undefined;
  }

  const findings = Array.isArray(result.findings) ? result.findings : [];
  const groupedResults = findings
    .map(toPreReviewResult)
    .reduce<AiPreReviewData["results"]>((groups, current) => {
      const existing = groups.find((group) => group.type === current.type);

      if (existing) {
        existing.findings.push(...current.findings);
        existing.title = `${PRECHECK_RESULT_TITLE_MAP[current.type]} ${existing.findings.length}`;
        return groups;
      }

      groups.push({
        ...current,
        title: `${PRECHECK_RESULT_TITLE_MAP[current.type]} ${current.findings.length}`,
      });
      return groups;
    }, [])
    .sort(
      (a, b) =>
        PRECHECK_RESULT_TYPE_ORDER.indexOf(a.type) -
        PRECHECK_RESULT_TYPE_ORDER.indexOf(b.type),
    );

  return {
    perspectiveLabel: "처음 읽는 사람 관점",
    results: groupedResults,
    revisionProposal: result.rewrite
      ? {
          title: "수정안",
          changedCount: result.rewrite.changedCount,
          content: result.rewrite.content,
          notice: result.rewriteApplied
            ? "* 수정안이 이미 적용된 상태예요."
            : "* 자동 덮어쓰지 않고, 적용을 눌러야 본문이 바뀌어요.",
        }
      : undefined,
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

const DraftView = ({ section, permissions }: DraftViewProps) => {
  const sectionId = section.projectSectionId;
  const revalidator = useRevalidator();
  const myProfileQuery = useMyProfile(true);

  const initialSynthesisRequestId = getStoredSynthesisRequestId(sectionId);
  const initialDraftRequestId = getStoredDraftRequestId(sectionId);
  const initialPrecheckRequestId = getStoredPrecheckRequestId(sectionId);

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
  const [precheckRequestId, setPrecheckRequestId] = useState<string | null>(
    initialPrecheckRequestId,
  );
  const [draftContent, setDraftContent] = useState<string | null>(null);
  const [draftVersion, setDraftVersion] = useState<number | null>(null);
  const [isAcquiringEditLease, setIsAcquiringEditLease] = useState(false);
  const [isDraftLeaseOwned, setIsDraftLeaseOwned] = useState(false);
  const [leaseExpiresAt, setLeaseExpiresAt] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSavedDraftContent, setLastSavedDraftContent] = useState<
    string | null
  >(null);
  const [draftSaveErrorMessage, setDraftSaveErrorMessage] = useState<
    string | null
  >(null);
  const [editActionErrorMessage, setEditActionErrorMessage] = useState<
    string | null
  >(null);
  const [isRequestingReadabilityCheck, setIsRequestingReadabilityCheck] =
    useState(false);
  const [readabilityRequestErrorMessage, setReadabilityRequestErrorMessage] =
    useState<string | null>(null);
  const [isApplyingRevision, setIsApplyingRevision] = useState(false);
  const [applyRevisionErrorMessage, setApplyRevisionErrorMessage] = useState<
    string | null
  >(null);
  const [isMovingToReviewRequest, setIsMovingToReviewRequest] = useState(false);
  const [moveToReviewRequestErrorMessage, setMoveToReviewRequestErrorMessage] =
    useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(
    null,
  );
  const [isStartingDraftGeneration, setIsStartingDraftGeneration] =
    useState(false);

  const myUserId = myProfileQuery.data?.userId ?? null;
  const myDisplayName = myProfileQuery.data?.name
    ? `${myProfileQuery.data.name} 님`
    : "내";

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
    enabled:
      permissions.canManageOpinionCollection &&
      section.sectionStatus === "SYNTHESIZING" &&
      !synthesisRequestId,
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
  const shouldFetchSynthesisResult =
    section.sectionStatus === "DRAFTING" || synthesisJobStatus === "SUCCEEDED";

  const synthesisResultQuery = useQuery({
    queryKey: [
      "workspace-synthesis-result",
      sectionId,
      effectiveSynthesisRequestId,
      synthesisJobStatus,
    ],
    queryFn: () => getSectionSynthesis(sectionId),
    enabled: shouldFetchSynthesisResult,
    refetchInterval: shouldFetchSynthesisResult
      ? LIVE_SYNC_REFETCH_INTERVAL_MS
      : false,
    refetchIntervalInBackground: true,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
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
      (section.sectionStatus === "DRAFTING" ||
        draftJobQuery.data?.status === "SUCCEEDED") &&
      !isDraftJobFeatureMismatch,
    retry: false,
    refetchInterval: isDraftLeaseOwned ? false : LIVE_SYNC_REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });

  useEffect(() => {
    if (draftResultQuery.data) {
      clearStoredDraftRequestId(sectionId);
    }
  }, [draftResultQuery.data, sectionId]);

  const leaseStatusQuery = useQuery({
    queryKey: ["workspace-draft-lease-status", sectionId],
    queryFn: () => getSectionDraftLeaseStatus(sectionId),
    enabled: Boolean(draftResultQuery.data),
    retry: false,
    refetchInterval: LIVE_SYNC_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
  });

  const precheckJobQuery = useQuery({
    queryKey: ["workspace-ai-job", "precheck", sectionId, precheckRequestId],
    queryFn: () => getAiJobStatus(precheckRequestId as string),
    enabled: Boolean(precheckRequestId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return !status || status === "REQUESTED"
        ? AI_JOB_POLLING_INTERVAL_MS
        : false;
    },
  });

  useEffect(() => {
    if (
      precheckJobQuery.data?.status === "SUCCEEDED" ||
      precheckJobQuery.data?.status === "FAILED"
    ) {
      clearStoredPrecheckRequestId(sectionId);
    }
  }, [precheckJobQuery.data?.status, sectionId]);

  const precheckResultQuery = useQuery({
    queryKey: [
      "workspace-precheck-result",
      sectionId,
      precheckRequestId,
      precheckJobQuery.data?.status,
      draftStage,
    ],
    queryFn: () => getSectionDraftPrecheck(sectionId),
    enabled:
      draftStage === "reviewable" ||
      precheckJobQuery.data?.status === "SUCCEEDED",
    retry: false,
  });

  const effectiveDraftContent = isDraftLeaseOwned
    ? (draftContent ?? draftResultQuery.data?.content ?? null)
    : (draftResultQuery.data?.content ?? draftContent ?? null);
  const effectiveDraftVersion = isDraftLeaseOwned
    ? (draftVersion ?? draftResultQuery.data?.contentVersion ?? null)
    : (draftResultQuery.data?.contentVersion ?? draftVersion ?? null);
  const precheckCurrentResult = precheckResultQuery.data?.currentResult;
  const precheckResultRequestId =
    precheckCurrentResult?.requestId ??
    precheckResultQuery.data?.latestJob?.requestId ??
    null;
  const preReviewData = useMemo(() => {
    return toPreReviewData(precheckCurrentResult);
  }, [precheckCurrentResult]);
  const leaseEditor = leaseStatusQuery.data?.editor ?? null;
  const isLockedByAnotherEditor = Boolean(
    leaseStatusQuery.data?.locked &&
    leaseEditor &&
    (myUserId === null || leaseEditor.userId !== myUserId),
  );
  const hasPendingDraftChanges =
    draftStage === "editing" &&
    effectiveDraftContent !== null &&
    effectiveDraftContent !== lastSavedDraftContent;

  const runtimeDraftState = useMemo(() => {
    if (
      !draftResultQuery.data ||
      effectiveDraftContent === null ||
      effectiveDraftVersion === null
    ) {
      return null;
    }

    const runtimeDraft: SectionDraftResponse = {
      ...draftResultQuery.data,
      content: effectiveDraftContent,
      contentVersion: effectiveDraftVersion,
      activeEditor: draftResultQuery.data.activeEditor,
    };

    if (draftStage === "editing") {
      return buildEditingStateFromDraft(runtimeDraft, {
        isLockedByAnotherEditor,
        editorName: leaseEditor?.name ?? null,
        myDisplayName,
      });
    }

    if (draftStage === "edited") {
      return buildEditedStateFromDraft(runtimeDraft);
    }

    if (draftStage === "reviewable") {
      return buildReviewableStateFromDraft(runtimeDraft, preReviewData);
    }

    return buildGeneratedStateFromDraft(
      runtimeDraft,
      isLockedByAnotherEditor,
      leaseEditor?.name ?? null,
    );
  }, [
    draftResultQuery.data,
    effectiveDraftContent,
    effectiveDraftVersion,
    draftStage,
    isLockedByAnotherEditor,
    leaseEditor?.name,
    myDisplayName,
    preReviewData,
  ]);

  const resolvedStage = useMemo<DebugDraftStage>(() => {
    if (runtimeDraftState) {
      if (
        draftStage === "reviewable" ||
        draftStage === "edited" ||
        draftStage === "editing"
      ) {
        return draftStage;
      }

      return "generated";
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

    if (leaseStatusQuery.isError) {
      return getDraftLeaseStatusErrorMessage(leaseStatusQuery.error);
    }

    if (precheckJobQuery.data?.status === "FAILED") {
      return (
        precheckJobQuery.data.failure?.message?.trim() ??
        getAiJobFailedMessage("AI 사전 검토")
      );
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
    leaseStatusQuery.isError,
    leaseStatusQuery.error,
    precheckJobQuery.data,
  ]);

  const handleSaveDraft = async () => {
    if (
      isSavingDraft ||
      effectiveDraftContent === null ||
      effectiveDraftVersion === null
    ) {
      return;
    }

    setIsSavingDraft(true);
    setDraftSaveErrorMessage(null);
    setEditActionErrorMessage(null);

    try {
      const lease = await acquireSectionDraftLease(sectionId);
      setIsDraftLeaseOwned(true);
      setLeaseExpiresAt(lease.expiresAt);

      await saveSectionDraft(sectionId, {
        content: effectiveDraftContent,
        baseVersion: effectiveDraftVersion,
      });

      const latestDraftResult = await draftResultQuery.refetch();
      const latestDraft = latestDraftResult.data ?? null;

      if (latestDraft) {
        setDraftContent(latestDraft.content);
        setDraftVersion(latestDraft.contentVersion);
        setLastSavedDraftContent(latestDraft.content);
      }

      try {
        await releaseSectionDraftLease(sectionId);
      } catch (error) {
        if (!isDraftLeaseNoLongerOwnedError(error)) {
          setEditActionErrorMessage(getReleaseDraftLeaseErrorMessage(error));
          return;
        }
      }

      setIsDraftLeaseOwned(false);
      setLeaseExpiresAt(null);
      setDraftStage("generated");
      void leaseStatusQuery.refetch();
    } catch (error) {
      setDraftSaveErrorMessage(getSaveSectionDraftErrorMessage(error));
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleOpenEvidence = () => {
    // TODO: 근거 상세 패널/모달 연결
  };

  const handleRequestReadabilityCheck = async () => {
    setReadabilityRequestErrorMessage(null);
    setDraftStage("reviewable");

    if (precheckRequestId) {
      return;
    }

    setIsRequestingReadabilityCheck(true);

    try {
      const { requestId } = await requestSectionDraftPrecheck(sectionId);
      setStoredPrecheckRequestId(sectionId, requestId);
      setPrecheckRequestId(requestId);
    } catch (error) {
      setReadabilityRequestErrorMessage(
        getRequestSectionDraftPrecheckErrorMessage(error),
      );
    } finally {
      setIsRequestingReadabilityCheck(false);
    }
  };

  const handleApplyRevision = async (): Promise<boolean> => {
    if (
      isApplyingRevision ||
      !precheckCurrentResult ||
      !precheckResultRequestId
    ) {
      return false;
    }

    setIsApplyingRevision(true);
    setApplyRevisionErrorMessage(null);

    try {
      await applySectionDraftPrecheck(sectionId, {
        requestId: precheckResultRequestId,
        checkedContentVersion: precheckCurrentResult.checkedContentVersion,
      });

      const latestDraftResult = await draftResultQuery.refetch();
      const latestDraft = latestDraftResult.data ?? null;

      if (!latestDraft) {
        throw new Error("최신 초안을 불러오지 못했습니다.");
      }

      setDraftContent(latestDraft.content);
      setDraftVersion(latestDraft.contentVersion);
      setLastSavedDraftContent(latestDraft.content);
      await precheckResultQuery.refetch();

      return true;
    } catch (error) {
      setApplyRevisionErrorMessage(
        getApplySectionDraftPrecheckErrorMessage(error),
      );
      return false;
    } finally {
      setIsApplyingRevision(false);
    }
  };

  const handleKeepRevision = () => {
    setApplyRevisionErrorMessage(null);
  };

  const handleMoveToEditing = async () => {
    if (effectiveDraftContent === null || effectiveDraftVersion === null) {
      setEditActionErrorMessage("초안을 먼저 불러온 뒤 다시 시도해 주세요.");
      return;
    }

    setIsAcquiringEditLease(true);
    setEditActionErrorMessage(null);

    try {
      const lease = await acquireSectionDraftLease(sectionId);
      setLeaseExpiresAt(lease.expiresAt);
      setIsDraftLeaseOwned(true);
      setDraftContent(effectiveDraftContent);
      setDraftVersion(effectiveDraftVersion);
      setLastSavedDraftContent(effectiveDraftContent);
      setDraftSaveErrorMessage(null);
      setDraftStage("editing");
      void leaseStatusQuery.refetch();
    } catch (error) {
      setEditActionErrorMessage(getAcquireDraftLeaseErrorMessage(error));
    } finally {
      setIsAcquiringEditLease(false);
    }
  };

  const handleDraftContentChange = (content: string) => {
    setDraftContent(content);
    setDraftSaveErrorMessage(null);
  };

  const handleFinishEditing = async () => {
    try {
      await releaseSectionDraftLease(sectionId);
    } catch (error) {
      if (!isDraftLeaseNoLongerOwnedError(error)) {
        setEditActionErrorMessage(getReleaseDraftLeaseErrorMessage(error));
        return;
      }
    }

    setDraftContent(lastSavedDraftContent);
    setDraftSaveErrorMessage(null);
    setIsDraftLeaseOwned(false);
    setLeaseExpiresAt(null);
    setDraftStage("generated");
    void leaseStatusQuery.refetch();
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

  const handleCreateDraft = async (decisions: IssueDecisionSubmission[]) => {
    if (!permissions.canGenerateDraft) {
      return;
    }

    setIsStartingDraftGeneration(true);
    setActionErrorMessage(null);

    try {
      await Promise.all(
        decisions.map((decision) => {
          const issueId = Number(decision.issueId);

          if (!Number.isInteger(issueId) || issueId <= 0) {
            throw new Error("유효하지 않은 쟁점 번호입니다.");
          }

          return decideIssue(issueId, {
            selectedOption: decision.selectedOption,
            customInput: decision.customInput,
          });
        }),
      );

      if (decisions.length > 0) {
        await synthesisResultQuery.refetch();
      }
    } catch (error) {
      setActionErrorMessage(getDecideIssueErrorMessage(error));
      void synthesisResultQuery.refetch();
      setIsStartingDraftGeneration(false);
      return;
    }

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

  const handleSubmitEvidenceAnswer = async (
    issueIdValue: string,
    content: string,
  ) => {
    const issueId = Number(issueIdValue);

    if (!Number.isInteger(issueId) || issueId <= 0) {
      throw new Error("유효하지 않은 쟁점 번호입니다.");
    }

    try {
      await answerIssue(issueId, { content: content.trim() });
      await synthesisResultQuery.refetch();
    } catch (error) {
      throw new Error(getAnswerIssueErrorMessage(error), { cause: error });
    }
  };

  const handleRequestEvidence = async (
    issueIdValue: string,
    targetUserId: number,
  ) => {
    if (!permissions.canManageIssues) {
      return;
    }

    const issueId = Number(issueIdValue);

    if (!Number.isInteger(issueId) || issueId <= 0) {
      throw new Error("유효하지 않은 쟁점 번호입니다.");
    }

    try {
      await requestIssueEvidence(issueId, { targetUserId });
      await synthesisResultQuery.refetch();
    } catch (error) {
      throw new Error(getRequestIssueEvidenceErrorMessage(error), {
        cause: error,
      });
    }
  };

  const isOpinionAnalyzingStage = resolvedStage === "opinion-analyzing";
  const isIssueCoordinationStage = resolvedStage === "issue-coordination";

  useEffect(() => {
    if (resolvedStage !== "editing" || !isDraftLeaseOwned || !leaseExpiresAt) {
      return;
    }

    const expiresAtMs = Date.parse(leaseExpiresAt);

    if (Number.isNaN(expiresAtMs)) {
      return;
    }

    const dueIn = Math.max(
      DRAFT_LEASE_HEARTBEAT_MIN_INTERVAL_MS,
      expiresAtMs - Date.now() - DRAFT_LEASE_HEARTBEAT_BUFFER_MS,
    );

    const heartbeatTimer = window.setTimeout(async () => {
      try {
        const result = await refreshSectionDraftLease(sectionId);
        setLeaseExpiresAt(result.expiresAt);
      } catch (error) {
        setEditActionErrorMessage(getRefreshDraftLeaseErrorMessage(error));
      }
    }, dueIn);

    return () => {
      window.clearTimeout(heartbeatTimer);
    };
  }, [resolvedStage, isDraftLeaseOwned, leaseExpiresAt, sectionId]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasPendingDraftChanges || isSavingDraft) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasPendingDraftChanges, isSavingDraft]);

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
          {permissions.canManageOpinionCollection &&
            synthesisStartQuery.isError &&
            !effectiveSynthesisRequestId && (
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
          onSubmitEvidenceAnswer={handleSubmitEvidenceAnswer}
          onRequestEvidence={handleRequestEvidence}
          isCreatingDraft={isStartingDraftGeneration}
          canManageIssues={permissions.canManageIssues}
          canGenerateDraft={permissions.canGenerateDraft}
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
              onDraftContentChange={handleDraftContentChange}
              onSaveDraft={handleSaveDraft}
              onFinishEditing={handleFinishEditing}
              onMoveToReviewRequest={handleMoveToReviewRequest}
              isAcquiringEditLease={isAcquiringEditLease}
              isEditDraftDisabled={isLockedByAnotherEditor}
              editActionErrorMessage={editActionErrorMessage}
              isSavingDraft={isSavingDraft}
              draftSaveErrorMessage={draftSaveErrorMessage}
              isRequestingReadabilityCheck={
                isRequestingReadabilityCheck ||
                precheckJobQuery.data?.status === "REQUESTED"
              }
              readabilityRequestErrorMessage={readabilityRequestErrorMessage}
              onApplyRevision={handleApplyRevision}
              onKeepRevision={handleKeepRevision}
              isApplyingRevision={isApplyingRevision}
              applyRevisionErrorMessage={applyRevisionErrorMessage}
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
