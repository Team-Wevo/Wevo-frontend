# WEVO

> 대학생 팀 프로젝트 협업을 위한 AI 기반 서비스

---

# 📖 프로젝트 소개

Wevo는 공모전, 팀 프로젝트, 대외활동에서 여러 구성원의 흩어진 의견과 초안을 하나의 결과물로 완성할 수 있도록 돕는 실시간 AI 협업 워크스페이스입니다.

---

## ✨ 주요 기능

### 🔐 소셜 로그인 및 프로젝트 생성

- Google, Kakao 소셜 로그인 지원
- 프로젝트 생성 및 초기 설정
- 인증 상태 기반 접근 제어

### 📝 실시간 협업

- 작업 보드에서 의견 작성 및 공유
- 팀원 의견 실시간 반영
- 참여 현황 확인

### 🤖 AI 퍼실리테이터

- AI를 활용한 의견 분석 및 쟁점 정리
- 프로젝트 초안 자동 생성
- AI 분석 결과 및 근거 제공

### ✅ 검토 및 결과물 관리

- 팀원 검토 및 수정 요청
- 프로젝트 확정 프로세스
- 결과물 미리보기 및 내보내기

### 🎨 공통 UI 및 시스템

- 디자인 시스템 기반 UI 제공
- 공통 컴포넌트 및 API 관리
- 일관된 로딩 및 에러 처리

---

## 🔄 서비스 플로우

| 단계                  | 사용자 행동                                             |
| --------------------- | ------------------------------------------------------- |
| **1. 프로젝트 설정**  | 아이디어를 입력하고 결과물 유형과 전달 대상을 설정한다. |
| **2. 의견 작성**      | 팀원들이 섹션의 항목별로 의견을 작성한다.               |
| **3. 의견 통합**      | 섹션에 반영할 의견을 선택한다.                          |
| **4. 읽힘 점검**      | 정리된 섹션 본문에 대한 점검을 요청한다.                |
| **5. 실제 이해 확인** | 검토 링크를 팀원이나 외부 검토자에게 공유한다.          |
| **6. 섹션 확정**      | 팀장이 검토된 섹션을 확정한다.                          |
| **7. 변경 영향 확인** | 확정된 섹션의 내용을 수정한다.                          |
| **8. 결과물 완성**    | 확정된 섹션을 모아 전체 결과물을 확인한다.              |

---

## 👥 팀원 및 역할

| 담당자 | 담당 기능                                                                           |
| ------ | ----------------------------------------------------------------------------------- |
| 구다연 | 계정 설정 팝업 구현                                                                 |
| 신연우 | 메인 팀원 화면(사이드바, 헤더, 전체 레이아웃) 구현<br>프로젝트 탭 및 완성본 탭 구현 |
| 유금진 | 메인 팀원 화면(작업 영역) 구현<br>프로젝트 탭 및 완성본 탭 구현                     |
| 장현빈 | 온보딩 화면(메인 홈 화면) 및 온보딩 설정 팝업 구현                                  |

---

## 🛠️ 기술 스택

| 분류            | 기술                     | 설명                                         |
| --------------- | ------------------------ | -------------------------------------------- |
| Framework       | React                    | 사용자 인터페이스 개발                       |
| Language        | TypeScript               | 타입 안정성 및 유지보수 향상                 |
| Build Tool      | Vite                     | 빠른 개발 서버 및 번들링                     |
| Styling         | Tailwind CSS v4          | 유틸리티 기반 스타일링 및 디자인 시스템 적용 |
| Routing         | React Router             | 페이지 라우팅 및 네비게이션                  |
| Server State    | TanStack Query           | 서버 데이터 조회, 캐싱 및 동기화             |
| Client State    | Zustand                  | 전역 UI 및 클라이언트 상태 관리              |
| Form            | React Hook Form          | 폼 상태 관리 및 유효성 검사                  |
| Realtime        | Server-Sent Events (SSE) | 실시간 협업 데이터 반영                      |
| Icons           | Lucide React             | UI 아이콘                                    |
| Package Manager | pnpm                     | 패키지 및 의존성 관리                        |
| Deploy          | Vercel                   | 프로젝트 배포                                |

---

## 📂 폴더 구조

> `features`와 `pages` 구조는 프로젝트에 맞게 수정 예정

```text
wevo-frontend/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  │  └─ feature_request.md
│  ├─ workflows/
│  │  ├─ ci.yml
│  │  └─ deploy.yml
│  └─ pull_request_template.md
├─ .husky/
│  └─ pre-commit
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ layouts/
│  │  ├─ providers/
│  │  └─ router/
│  ├─ assets/
│  ├─ features/
│  ├─ pages/
│  ├─ shared/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ config/
│  │  ├─ constants/
│  │  ├─ hooks/
│  │  ├─ types/
│  │  └─ utils/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ .env.example
├─ .prettierrc
├─ eslint.config.js
├─ package.json
├─ vite.config.ts
└─ README.md
```

---

## 🌿 브랜치 전략 (Branch Strategy)

기능 단위로 브랜치를 생성하며, 아래 네이밍 규칙을 따릅니다.

### 브랜치 규칙

```text
브랜치타입/이슈번호-기능명
```

### 예시

```text
feat/79-mypage-features
fix/83-bookmark-toggle
refactor/45-auth
```

---

## 🏷️ GitHub Labels

| Label           | 설명                          |
| --------------- | ----------------------------- |
| `bug`           | 버그 수정                     |
| `chore`         | 프로젝트 설정 및 기타 작업    |
| `design`        | UI 및 스타일 수정             |
| `documentation` | README, API 문서 등 문서 수정 |
| `enhancement`   | 기존 기능 개선                |
| `feature`       | 새로운 기능 개발              |
| `refactor`      | 기능 변경 없는 코드 구조 개선 |
| `revert`        | 이전 변경 사항 복구           |
| `test`          | 테스트 코드 작성              |

---

## 💬 커밋 컨벤션 (Commit Convention)

### 커밋 규칙

```text
타입: 설명 (#이슈번호)
```

### 예시

```text
feat: 북마크 토글 (#84)
fix: 로그인 오류 수정 (#32)
refactor: API 구조 개선 (#15)
docs: README 수정 (#7)
```

---

## 🚀 Pull Request 컨벤션

PR은 프로젝트에서 제공하는 템플릿을 사용하여 작성합니다.

### PR 구성

- 📌 관련 이슈
- 🏷️ PR 타입
- 📝 작업 내용
- 📸 스크린샷 (UI 변경 시)
- ✅ 체크리스트
- 📎 기타 참고사항
