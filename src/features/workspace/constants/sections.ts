export const WORKSPACE_SECTIONS = {
  background: {
    key: "background",
    label: "제안 배경",
  },
  problem: {
    key: "problem",
    label: "문제 및 필요성",
  },
  goal: {
    key: "goal",
    label: "목표 및 제안 범위",
  },
  content: {
    key: "content",
    label: "제안 내용",
  },
  solution: {
    key: "solution",
    label: "실행 방안",
  },
  effect: {
    key: "effect",
    label: "기대 효과",
  },
} as const;

export type WorkspaceSection = keyof typeof WORKSPACE_SECTIONS;

export const DEFAULT_WORKSPACE_SECTION: WorkspaceSection = "background";

export const isWorkspaceSection = (
  value: string | undefined,
): value is WorkspaceSection => {
  return Boolean(value && value in WORKSPACE_SECTIONS);
};
