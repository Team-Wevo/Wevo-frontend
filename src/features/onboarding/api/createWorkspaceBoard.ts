export type DocumentType = "proposal" | "presentation" | "free";

export type AudienceType = "judge" | "professor" | "member" | "custom";

export interface CreateWorkspaceBoardPayload {
  idea: string;
  documentType: DocumentType;
  audience: AudienceType;
  customAudience: string;
}

export interface CreateWorkspaceBoardResponse {
  projectId: number;
}

const MOCK_PROJECT_ID_STORAGE_KEY = "wevo:mock-project-id-seq";
const CREATE_WORKSPACE_BOARD_PATH = "/api/onboarding/workspace-board";

const getNextMockProjectId = () => {
  const previous = Number(localStorage.getItem(MOCK_PROJECT_ID_STORAGE_KEY));
  const normalized =
    Number.isFinite(previous) && previous > 0 ? previous : 1000;
  const next = normalized + 1;

  localStorage.setItem(MOCK_PROJECT_ID_STORAGE_KEY, String(next));

  return next;
};

const parseProjectIdFromResponse = (
  responseData: unknown,
): CreateWorkspaceBoardResponse | null => {
  if (typeof responseData !== "object" || responseData === null) {
    return null;
  }

  const candidate = responseData as { projectId?: unknown };

  if (typeof candidate.projectId !== "number") {
    return null;
  }

  return { projectId: candidate.projectId };
};

export const createWorkspaceBoard = async (
  payload: CreateWorkspaceBoardPayload,
): Promise<CreateWorkspaceBoardResponse> => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (apiBaseUrl) {
    const response = await fetch(
      `${apiBaseUrl}${CREATE_WORKSPACE_BOARD_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("작업보드 생성 요청에 실패했습니다.");
    }

    const json = (await response.json()) as unknown;
    const parsed = parseProjectIdFromResponse(json);

    if (!parsed) {
      throw new Error("작업보드 생성 응답 형식이 올바르지 않습니다.");
    }

    return parsed;
  }

  // 실제 API 미연결 환경에서는 모킹된 projectId를 반환하고 라우팅 흐름만 유지한다.
  return {
    projectId: getNextMockProjectId(),
  };
};
