# AGENTS.md

# WEVO Frontend Development Guide

WEVO는 React + TypeScript + Vite 기반의 프론트엔드 프로젝트입니다.

## 프로젝트 정보

- Framework: React
- Language: TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS v4
- Server State: TanStack Query
- Client State: Zustand
- Routing: React Router
- Package Manager: pnpm

---

## 실행 명령

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm check
```

변경 후에는 최소한 아래 명령어를 실행하여 오류를 확인합니다.

```bash
pnpm lint
pnpm build
```

---

## 프로젝트 구조

```
src
├── app            # 앱 전역 설정 (router, providers, layouts)
├── assets         # 이미지 및 정적 리소스
├── features       # 기능(도메인) 단위
├── pages          # 페이지 컴포넌트
├── shared         # 공통 컴포넌트 및 유틸
└── stores         # 전역 상태
```

### feature 구조

각 feature는 관련된 코드가 함께 위치하도록 구성합니다.

예시

```
features
└── project
    ├── api
    ├── components
    ├── hooks
    ├── types
    └── utils
```

---

## 컴포넌트 작성 규칙

- React Function Component를 사용합니다.
- TypeScript Interface를 사용하여 Props를 정의합니다.
- Props 타입은 컴포넌트 바로 위에 선언합니다.
- 불필요한 any 사용을 지양합니다.
- 한 컴포넌트의 역할이 커질 경우 작은 컴포넌트로 분리합니다.
- 기존 UI를 변경하지 않는 리팩토링을 우선합니다.

---

## 폴더 배치 규칙

### features

도메인에 종속되는 컴포넌트

예시

- project
- auth
- board
- ai
- export

### shared

프로젝트 전체에서 재사용 가능한 코드만 위치합니다.

예시

- Button
- Modal
- Input
- API Client
- Custom Hooks
- Constants
- Utils

특정 화면에서만 사용하는 컴포넌트는 shared에 추가하지 않습니다.

---

## 스타일 작성 규칙

- Tailwind CSS Utility Class를 사용합니다.
- 기존 디자인 시스템과 일관성을 유지합니다.
- 불필요한 CSS 파일을 추가하지 않습니다.
- 기존 spacing, radius, color token을 우선 사용합니다.

---

## 코드 작성 원칙

- 기존 코드 스타일을 유지합니다.
- 기존 네이밍 컨벤션을 따릅니다.
- 동일한 기능을 중복 구현하지 않습니다.
- 공통화 가능한 로직은 Hook 또는 shared로 분리합니다.
- import 순서는 기존 프로젝트 스타일을 유지합니다.
- 기존 컴포넌트를 우선 재사용합니다.

---

## 리팩토링 원칙

리팩토링 시에는

- UI 변경 금지
- 기존 동작 유지
- 타입 유지
- Props 변경 최소화
- 기존 API 변경 금지

를 우선합니다.

---

## 라우팅

라우팅 변경 시 반드시 함께 확인합니다.

```
src/app/router
```

또는

```
src/app/routes
```

---

## Copilot 작업 원칙

코드를 수정할 때는

1. 기존 구조를 최대한 유지합니다.
2. 기능 단위(feature) 구조를 우선합니다.
3. 큰 컴포넌트는 역할 단위로 분리합니다.
4. UI 변경 없이 리팩토링합니다.
5. 새로운 라이브러리는 꼭 필요한 경우에만 추가합니다.
6. 기존 코드 스타일과 네이밍을 유지합니다.

불필요한 구조 변경이나 대규모 리팩토링은 제안하지 않습니다.

---

## 완료 후 확인 사항

- TypeScript 오류 없음
- ESLint 오류 없음
- Build 성공
- import 경로 정상
- 사용하지 않는 import 제거
- 불필요한 console.log 제거

---
