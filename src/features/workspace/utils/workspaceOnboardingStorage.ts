const WORKSPACE_ONBOARDING_STORAGE_KEY_PREFIX = "wevo:workspace-onboarding:v1";

const getWorkspaceOnboardingStorageKey = (userId: number, projectId: string) =>
  `${WORKSPACE_ONBOARDING_STORAGE_KEY_PREFIX}:${userId}:${projectId}`;

export const hasSeenWorkspaceOnboarding = (
  userId: number,
  projectId: string,
): boolean => {
  try {
    return (
      localStorage.getItem(
        getWorkspaceOnboardingStorageKey(userId, projectId),
      ) === "true"
    );
  } catch {
    return false;
  }
};

export const markWorkspaceOnboardingAsSeen = (
  userId: number,
  projectId: string,
): void => {
  try {
    localStorage.setItem(
      getWorkspaceOnboardingStorageKey(userId, projectId),
      "true",
    );
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 현재 세션의 UI 동작만 유지한다.
  }
};
