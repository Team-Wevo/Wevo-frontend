# API 연동 규칙

## 공통 사용법

- 모든 JSON API 요청은 `apiClient`를 사용한다.
- 서버 응답은 `ApiResponse<T>`로 선언한다.
- 서버 오류 문구는 `getApiErrorMessage`로 추출한다.
- 서버 상태는 TanStack Query로 관리하고, 앱에 등록된 공통 `queryClient`를 사용한다.
- 토큰을 직접 읽거나 수정하지 않고 `tokenStorage` 함수를 사용한다.

```ts
import { apiClient, getApiErrorMessage, type ApiResponse } from "@/shared/api";

interface Project {
  projectId: number;
  title: string;
}

export const getProject = async (projectId: number) => {
  const response = await apiClient.get<ApiResponse<Project>>(
    `/api/projects/${projectId}`,
  );

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data;
};

try {
  await getProject(1);
} catch (error) {
  const message = getApiErrorMessage(error, "프로젝트 조회에 실패했습니다.");
}
```

## 인증 처리

`apiClient`는 Access Token을 요청 헤더에 자동으로 추가한다. 인증 API를 제외한
요청에서 401이 발생하면 Refresh Token으로 한 번만 재발급하고 원 요청을 다시
보낸다. 여러 요청이 동시에 401을 받아도 재발급 요청은 하나만 실행한다. 재발급이
실패하면 저장된 토큰을 제거한다.

## 예외

- `/public/**`처럼 인증이 필요 없는 API도 같은 클라이언트를 사용할 수 있다.
- 파일 다운로드는 `responseType: "blob"`을 지정하고 JSON 공통 응답이 아니라
  파일 응답으로 처리한다.
- HTTP 오류 응답에서는 `data`와 `errors`가 생략될 수 있다.
