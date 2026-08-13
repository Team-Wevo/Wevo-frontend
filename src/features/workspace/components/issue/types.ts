/** 쟁점을 해결하는 방식 — 선택지 중 고르거나, 근거를 요청하고 답변을 기다린다. */
export type IssueResolutionType = "choice" | "evidence-request";

export interface IssueOpinion {
  authorUserId?: number;
  memberName: string;
  content: string;
}

export interface IssueChoiceOption {
  id: string;
  label: string;
  /** 선택 시 값을 직접 적어야 하는 선택지 (예: "직접 입력") */
  isCustomInput?: boolean;
}

export interface EvidenceRequestStatus {
  requested: boolean;
  message: string;
  questionCount: number;
  answer?: {
    authorName: string;
    content: string;
    answeredAt: string;
  };
}

export interface WorkspaceIssue {
  id: string;
  order: number;
  title: string;
  resolutionType: IssueResolutionType;
  /** AI가 결정을 돕기 위해 던지는 질문 또는 안내 */
  aiHint: string;
  opinions: IssueOpinion[];
  /** resolutionType이 "choice"일 때만 존재 */
  options?: IssueChoiceOption[];
  /** resolutionType이 "evidence-request"일 때만 존재 */
  evidenceRequest?: EvidenceRequestStatus;
  /** 서버에 이미 저장된 결정. 재진입·팀원 조회 화면의 선택 상태 복원에 사용한다. */
  decision?: {
    selectedOption?: string;
    customInput?: string;
  };
}

export interface SharedProblem {
  /** 팀 의견을 종합한 공통 문제 */
  summary: string;
  /** 결정이 필요한 지점 */
  issueStatement: string;
}

export interface IssueCoordinationData {
  sharedProblem: SharedProblem;
  issues: WorkspaceIssue[];
}

/** 쟁점 id → 선택한 선택지 id */
export type IssueDecisionMap = Record<string, string>;

/** 쟁점 id → "직접 입력"으로 작성한 내용 */
export type IssueCustomInputMap = Record<string, string>;

export interface IssueDecisionSubmission {
  issueId: string;
  selectedOption?: string;
  customInput?: string;
}
