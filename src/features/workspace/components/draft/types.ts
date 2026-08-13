export type DraftStage =
  "generating" | "generated" | "editing" | "edited" | "reviewable";

export type DebugDraftStage =
  "opinion-analyzing" | "issue-coordination" | DraftStage;

export type DraftEditingMode = "self" | "locked";

export interface DraftActivity {
  label: string;
  tone: "success" | "processing";
}

export interface DraftEvidence {
  teamOpinionCount: number;
  issueDecisionCount: number;
  issueDecisionLabel?: string;
}

export type AiPreReviewResultType =
  "blocked_sentence" | "hidden_assumption" | "reader_question";

export interface AiPreReviewFinding {
  description: string;
  suggestion?: string;
}

export interface AiPreReviewResult {
  id: string;
  type: AiPreReviewResultType;
  title: string;
  findings: AiPreReviewFinding[];
}

export interface AiPreReviewData {
  perspectiveLabel: string;
  results: AiPreReviewResult[];
  revisionProposal?: {
    title: string;
    changedCount: number;
    content: string;
    notice: string;
  };
}

export interface DraftEditingMeta {
  currentEditorName: string;
  myDisplayName: string;
  defaultMode: DraftEditingMode;
}

export interface DraftViewState {
  stage: DraftStage;
  sourceLabel: "AI 생성" | "사용자 작성";
  activity: DraftActivity | null;
  summary: string;
  version: number;
  draftContent: string | null;
  evidence: DraftEvidence;
  editingMeta?: DraftEditingMeta;
  preReview?: AiPreReviewData;
}

export interface DraftStageOption {
  id: DebugDraftStage;
  label: string;
}

export interface DraftStageViewProps {
  state: DraftViewState;
  onEditDraft: () => void;
  onOpenEvidence: () => void;
  isEvidenceLoading?: boolean;
  evidenceErrorMessage?: string | null;
  onRequestReadabilityCheck: () => void;
  onApplyRevision?: () => Promise<boolean>;
  onKeepRevision?: () => void;
  onDraftContentChange?: (content: string) => void;
  onSaveDraft?: () => void;
  onFinishEditing?: () => void;
  onMoveToReviewRequest?: () => void;
  isAcquiringEditLease?: boolean;
  isEditDraftDisabled?: boolean;
  editActionErrorMessage?: string | null;
  isSavingDraft?: boolean;
  draftSaveErrorMessage?: string | null;
  isRequestingReadabilityCheck?: boolean;
  readabilityRequestErrorMessage?: string | null;
  canRequestReadabilityCheck?: boolean;
  isApplyingRevision?: boolean;
  applyRevisionErrorMessage?: string | null;
  canApplyRevision?: boolean;
  canMoveToReviewRequest?: boolean;
  isMovingToReviewRequest?: boolean;
  moveToReviewRequestErrorMessage?: string | null;
}
