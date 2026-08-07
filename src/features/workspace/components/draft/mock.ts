import type { AiAnalysisTaskStep } from "../blocks/AiDraftProgressCard";
import type { DraftStage, DraftViewState } from "./types";

const MOCK_DRAFT_CONTENT =
  "최근 대학생의 장학금 수요가 늘고 있으나, 관련 정보는 학교 홈페이지·장학재단·학과 공지 등 여러 곳에 흩어져 있다. 학생은 자신에게 맞는 장학금을 찾기 위해 여러 사이트를 오가며 반복적으로 탐색·비교해야 하고, 이 과정에서 적합한 공고를 놓치거나 마감을 지나치는 경우가 많다. 이에 흩어진 장학금 정보를 한곳에 모아, 자격 조건에 맞는 장학금을 비교·안내하는 서비스를 제안한다.";

export const MOCK_DRAFT_STATE_BY_STAGE: Record<DraftStage, DraftViewState> = {
  generating: {
    stage: "generating",
    sourceLabel: "AI 생성",
    activity: {
      label: "AI가 초안을 생성 중",
      tone: "processing",
    },
    summary: "AI가 팀 의견과 쟁점 결정을 반영해 초안을 만들고 있어요.",
    version: 1,
    draftContent: null,
    evidence: {
      teamOpinionCount: 3,
      issueDecisionCount: 1,
    },
  },
  generated: {
    stage: "generated",
    sourceLabel: "AI 생성",
    activity: {
      label: "초안 생성 완료",
      tone: "success",
    },
    summary: "AI가 팀 의견과 쟁점 결정을 반영해 만든 초안이에요.",
    version: 1,
    draftContent: MOCK_DRAFT_CONTENT,
    evidence: {
      teamOpinionCount: 3,
      issueDecisionCount: 1,
    },
  },
  editing: {
    stage: "editing",
    sourceLabel: "사용자 작성",
    activity: {
      label: "지현구 님 편집 중",
      tone: "success",
    },
    summary: "초안을 편집하고 있어요.",
    version: 1,
    draftContent: MOCK_DRAFT_CONTENT,
    evidence: {
      teamOpinionCount: 3,
      issueDecisionCount: 1,
    },
    editingMeta: {
      currentEditorName: "지현구",
      myDisplayName: "나",
      defaultMode: "self",
    },
  },
  edited: {
    stage: "edited",
    sourceLabel: "AI 생성",
    activity: {
      label: "지현구 님 편집 중",
      tone: "success",
    },
    summary: "편집이 완료된 초안입니다.",
    version: 2,
    draftContent: MOCK_DRAFT_CONTENT,
    evidence: {
      teamOpinionCount: 3,
      issueDecisionCount: 1,
    },
  },
  reviewable: {
    stage: "reviewable",
    sourceLabel: "사용자 작성",
    activity: {
      label: "AI 사전 검토 가능",
      tone: "success",
    },
    summary: "AI 읽힘 점검을 진행할 수 있어요.",
    version: 2,
    draftContent: MOCK_DRAFT_CONTENT,
    evidence: {
      teamOpinionCount: 3,
      issueDecisionCount: 1,
      issueDecisionLabel: "확정 결정",
    },
    preReview: {
      perspectiveLabel: "처음 읽는 사람 관점",
      results: [
        {
          id: "blocked-sentences",
          type: "blocked_sentence",
          title: "막히는 문장 2",
          findings: [
            {
              description:
                '"비교·안내하는 서비스" — 무엇을 기준으로 비교·안내하는지 처음 보면 막혀요.',
              suggestion:
                '수정 방향: "자격 요건을 분석해 신청 가능한 공고를 골라준다"처럼 기준을 한 줄 덧붙이세요.',
            },
            {
              description:
                '"한곳에 모아" — 어떤 정보를 어떻게 모으는지 구체적으로 보이지 않아요.',
              suggestion:
                "수정 방향: 수집 대상(학교·재단·학과 공지 등)을 예시로 보여주세요.",
            },
          ],
        },
        {
          id: "hidden-assumption",
          type: "hidden_assumption",
          title: "숨은 전제 1",
          findings: [
            {
              description:
                '독자가 "기존 탐색이 번거롭다"를 이미 안다고 가정하고 있어요.',
              suggestion:
                "수정 방향: 왜 번거로운지 한 줄 배경을 추가하면 자연스러워요.",
            },
          ],
        },
        {
          id: "reader-question",
          type: "reader_question",
          title: "독자 질문 1",
          findings: [
            {
              description:
                '"추천 정확도는 어떻게 보장하나요?"가 자연스럽게 떠올라요.',
            },
          ],
        },
      ],
      revisionProposal: {
        title: "수정안",
        changedCount: 3,
        content:
          "최근 대학생의 장학금 수요가 늘고 있으나, 관련 정보는 학교·재단·학과 공지 등 여러 곳에 흩어져 있어 학생이 매번 여러 사이트를 오가며 탐색·비교해야 하는 번거로움이 크다. 이 과정에서 적합한 공고를 놓치거나 마감을 지나치는 경우도 많다. 이에 흩어진 공고를 한곳에 모으고, 학생의 자격 요건을 분석해 신청 가능성이 높은 장학금을 골라 마감·서류까지 안내하는 서비스를 제안한다.",
        notice: "* 자동 덮어쓰지 않고, 적용을 눌러야 본문이 바뀌어요.",
      },
    },
  },
};

// 진행 상태는 useSequentialTaskProgress가 시간에 따라 채운다.
export const MOCK_ANALYSIS_TASK_STEPS: AiAnalysisTaskStep[] = [
  {
    id: "common-opinions",
    label: "공통된 의견 확인",
  },
  {
    id: "different-viewpoints",
    label: "서로 다른 관점 분석",
  },
  {
    id: "additional-info",
    label: "추가로 필요한 정보 확인",
  },
];
