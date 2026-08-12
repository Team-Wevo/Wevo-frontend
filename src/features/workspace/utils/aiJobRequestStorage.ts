type AiJobType = "synthesis" | "draft" | "precheck";

const buildStorageKey = (type: AiJobType, sectionId: number) => {
  return `workspace:${type}:request:${sectionId}`;
};

const getStoredRequestId = (
  type: AiJobType,
  sectionId: number,
): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const requestId = window.sessionStorage.getItem(
    buildStorageKey(type, sectionId),
  );
  return requestId && requestId.trim() ? requestId : null;
};

const setStoredRequestId = (
  type: AiJobType,
  sectionId: number,
  requestId: string,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(buildStorageKey(type, sectionId), requestId);
};

const clearStoredRequestId = (type: AiJobType, sectionId: number) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(buildStorageKey(type, sectionId));
};

export const getStoredSynthesisRequestId = (sectionId: number) => {
  return getStoredRequestId("synthesis", sectionId);
};

export const setStoredSynthesisRequestId = (
  sectionId: number,
  requestId: string,
) => {
  setStoredRequestId("synthesis", sectionId, requestId);
};

export const clearStoredSynthesisRequestId = (sectionId: number) => {
  clearStoredRequestId("synthesis", sectionId);
};

export const getStoredDraftRequestId = (sectionId: number) => {
  return getStoredRequestId("draft", sectionId);
};

export const setStoredDraftRequestId = (
  sectionId: number,
  requestId: string,
) => {
  setStoredRequestId("draft", sectionId, requestId);
};

export const clearStoredDraftRequestId = (sectionId: number) => {
  clearStoredRequestId("draft", sectionId);
};

export const getStoredPrecheckRequestId = (sectionId: number) => {
  return getStoredRequestId("precheck", sectionId);
};

export const setStoredPrecheckRequestId = (
  sectionId: number,
  requestId: string,
) => {
  setStoredRequestId("precheck", sectionId, requestId);
};

export const clearStoredPrecheckRequestId = (sectionId: number) => {
  clearStoredRequestId("precheck", sectionId);
};
