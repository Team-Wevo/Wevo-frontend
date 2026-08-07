import type { IssueCoordinationData } from "./types";

// TODO: /api/project-sections/{sectionId}/opinion-clusters 연동 시 교체
export const MOCK_ISSUE_COORDINATION: IssueCoordinationData = {
  sharedProblem: {
    summary:
      "팀 의견 4건을 종합하면, 초안 작성보다 나눠 쓴 내용을 하나의 흐름으로 맞추는 과정에서 반복 수정이 발생한다는 점이 공통적입니다.",
    issueStatement:
      "쟁점: 문제를 ‘글쓰기 품질’로 볼지, ‘팀 통합 과정’으로 볼지 결정이 필요합니다.",
  },
  issues: [
    {
      id: "issue-core-problem",
      order: 1,
      title: "핵심 문제가 서로 다르게 정의되었어요.",
      resolutionType: "choice",
      aiHint: "초기에 집중할 핵심 문제를 하나만 고른다면?",
      opinions: [
        { memberName: "지현", content: "정보가 흩어져 있어 “탐색”이 어렵다" },
        { memberName: "예진", content: "“신청 일정·서류 관리”가 핵심이다" },
      ],
      options: [
        { id: "search", label: "정보 탐색·자격 비교" },
        { id: "schedule", label: "신청 일정·서류 관리" },
        { id: "both", label: "둘 다 포함" },
        { id: "custom", label: "직접 입력", isCustomInput: true },
      ],
    },
    {
      id: "issue-search-hours",
      order: 2,
      title: "“탐색에 6시간”의 근거가 부족해요.",
      resolutionType: "evidence-request",
      aiHint: "평균 탐색 시간을 뒷받침할 근거가 필요해요.",
      opinions: [],
      evidenceRequest: {
        message: "민수 님에게 추가 근거를 요청했어요 · 답변 대기",
        questionCount: 1,
      },
    },
  ],
};
