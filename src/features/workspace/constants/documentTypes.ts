export const WORKSPACE_DOCUMENT_TYPES = {
  proposal: {
    key: "proposal",
    label: "제안서",
    description: "문제 정의와 해결 제안을 중심으로 작성해요.",
  },
  presentation: {
    key: "presentation",
    label: "발표 구성안",
    description: "전달 흐름과 핵심 메시지를 중심으로 구성해요.",
  },
} as const;

export type WorkspaceDocumentType = keyof typeof WORKSPACE_DOCUMENT_TYPES;

export const DEFAULT_WORKSPACE_DOCUMENT_TYPE: WorkspaceDocumentType =
  "proposal";

export const isWorkspaceDocumentType = (
  value: string | undefined,
): value is WorkspaceDocumentType => {
  return Boolean(value && value in WORKSPACE_DOCUMENT_TYPES);
};
