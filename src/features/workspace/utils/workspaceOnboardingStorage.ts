const WORKSPACE_ONBOARDING_PENDING_KEY_PREFIX =
  "wevo:workspace-onboarding-pending:v2";

const getWorkspaceOnboardingPendingKey = (projectId: string) =>
  `${WORKSPACE_ONBOARDING_PENDING_KEY_PREFIX}:${projectId}`;

/** 프로젝트 생성 직후 최초 진입에서만 가이드를 열도록 일회성 표시를 예약한다. */
export const markWorkspaceOnboardingAsPending = (projectId: string): void => {
  try {
    sessionStorage.setItem(getWorkspaceOnboardingPendingKey(projectId), "true");
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 가이드를 생략한다.
  }
};

export const hasPendingWorkspaceOnboarding = (projectId: string): boolean => {
  try {
    return (
      sessionStorage.getItem(getWorkspaceOnboardingPendingKey(projectId)) ===
      "true"
    );
  } catch {
    return false;
  }
};

/** 첫 워크스페이스 렌더 직후 표시 예약을 제거해 새로고침·재진입 노출을 막는다. */
export const clearPendingWorkspaceOnboarding = (projectId: string): void => {
  try {
    sessionStorage.removeItem(getWorkspaceOnboardingPendingKey(projectId));
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 별도 처리가 필요하지 않다.
  }
};
