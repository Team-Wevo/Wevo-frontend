<div align="center">

<img src="./public/Wevo-logo.svg" width="100" />

<br />

<h1>
<span style="color:#6D5DFB">WEVO</span>
</h1>

<h3>
AI 기반 대학생 팀 프로젝트 협업 플랫폼
</h3>

<p>
<span style="color:#94A3B8">
AI와 함께 아이디어를 모으고,<br />
팀의 생각을 정리하고,<br />
완성도 높은 결과물까지 만들어가는 협업 서비스
</span>
</p>

</br>
</br>

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📚 Table of Contents

- [📖 About WEVO](#-about-wevo)
- [✨ Features](#-features)
- [🔄 Service Flow](#-service-flow)
  - [🛠 Tech Stack](#-tech-stack)
- [💻 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
    - [1️⃣ Clone Repository](#1️⃣-clone-repository)
    - [2️⃣ Environment Variables](#2️⃣-environment-variables)
    - [3️⃣ Install Dependencies](#3️⃣-install-dependencies)
    - [4️⃣ Start Development Server](#4️⃣-start-development-server)
- [🔗 API Architecture](#-api-architecture)
- [📂 Project Structure](#-project-structure)
- [🌿 Git Convention](#-git-convention)
  - [🌱 Branch Naming](#-branch-naming)
  - [🏷 GitHub Labels](#-github-labels)
  - [💬 Commit Convention](#-commit-convention)
  - [🚀 Pull Request](#-pull-request)
- [👥 Team](#-team)

---

# 📖 About WEVO

> **WEVO는 대학생 팀 프로젝트 협업을 위한 AI 기반 워크스페이스입니다.**

팀 프로젝트를 진행하며 발생하는 **의견 파편화**와 **결과물 정리의 어려움**을 해결합니다. WEVO는 여러 구성원의 흩어진 아이디어를 실시간으로 모으고, AI 퍼실리테이터를 통해 **의견 분석 → AI 초안 생성 → 팀원 검토 및 수정 → 최종 결과물 Export**까지 하나의 통합 공간에서 연속성 있게 연결합니다.

---

# ✨ Features

| 기능 | 설명 | 주요 화면 |
| :--- | :--- | :--- |
| **🔐 Authentication** | Google / Kakao OAuth 2.0 로그인<br>JWT 기반 토큰 인증 및 자동 갱신<br>인증 상태에 따른 Route Guard 적용 | <img src="https://github.com/user-attachments/assets/2178c932-8156-4b24-9ff1-8676169b5e98" width="400" /> <img src="https://github.com/user-attachments/assets/e026f55b-e03d-4a13-b965-ebb92250eb11" width="400" /> |
| **👥 Collaboration** | 실시간 팀원 의견 작성 및 공유<br>팀원별 참여 현황 및 상태 확인 | <img src="https://github.com/user-attachments/assets/565d6617-631c-4e76-a153-d09e7f06dc90" width="400" /> <img src="https://github.com/user-attachments/assets/0f3a5629-9f30-4b1d-9e69-9fceaba5d934" width="400" /> |
| **🤖 AI Facilitator** | 팀원 의견 종합 분석 및 근거 기반 AI 초안 자동 생성 | <img src="https://github.com/user-attachments/assets/37e87a0b-8a4a-46a1-99b1-a38702df1c96" width="400" /> <img src="https://github.com/user-attachments/assets/00527666-7a0a-4c51-82d7-caddf07c1094" width="400" /> |
| **📄 Review & Export** | AI 초안에 대한 팀원별 검토 및 피드백/수정 요청<br>최종 결과물 미리보기 및 다각도 Export 지원 | <img src="https://github.com/user-attachments/assets/5b743249-f9f5-459e-9ec7-b601ab108b87" width="400" /> <img src="https://github.com/user-attachments/assets/d3712e92-2668-489c-9d87-ce0b56071135" width="400" /> |

---

# 🔄 Service Flow

| 단계  | 과정             | 설명                                              |
| ----- | ---------------- | ------------------------------------------------- |
| 🚀 01 | 프로젝트 생성    | 프로젝트 목표와 기본 정보를 설정합니다            |
| 💡 02 | 의견 작성 & 공유 | 팀원들이 아이디어와 의견을 자유롭게 공유합니다    |
| 🤖 03 | AI 의견 분석     | 여러 의견을 AI가 분석하고 핵심 내용을 정리합니다  |
| 📝 04 | AI 초안 생성     | 정리된 의견을 기반으로 프로젝트 초안을 생성합니다 |
| ✏️ 05 | 검토 및 수정     | 팀원들이 초안을 확인하고 함께 개선합니다          |
| 📦 06 | 결과물 완성      | 완성된 결과물을 저장하고 Export합니다             |

## 🛠 Tech Stack

| Category               | Tech Stack                | Why We Chose It                                                 |
| :--------------------- | :------------------------ | :-------------------------------------------------------------- |
| ⚛️ **Framework**       | React 19                  | 최신 React 기능을 활용하여 사용자 경험과 비동기 렌더링을 최적화 |
| 📘 **Language**        | TypeScript 6.0            | 엄격한 타입 시스템으로 런타임 오류를 줄이고 유지보수성을 향상   |
| ⚡ **Build Tool**      | Vite 8                    | 빠른 HMR과 빌드 성능을 통해 개발 생산성을 향상                  |
| 🎨 **Styling**         | Tailwind CSS v4           | Utility-first 방식으로 일관된 디자인 시스템 구축                |
| 🧭 **Routing**         | React Router              | 선언적 라우팅 기반의 직관적인 페이지 전환                       |
| 🗂 **State**            | TanStack Query<br>Zustand | Server State와 Client State를 분리하여 효율적인 상태 관리       |
| 📝 **Form**            | React Hook Form           | 불필요한 리렌더링을 최소화하고 폼 유효성 검사 최적화            |
| 🎯 **Icons**           | Lucide React              | 일관된 디자인 시스템을 위한 아이콘 사용                         |
| 📦 **Package Manager** | pnpm                      | 빠른 의존성 설치 및 관리                                        |
| 🚀 **Deploy**          | Vercel                    | CI/CD 기반 자동 배포                                            |

---

# 💻 Getting Started

## 📋 Prerequisites

프로젝트를 실행하기 위해 아래 환경이 필요합니다.

- Node.js **20.x** 이상
- pnpm **9.x** 이상

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-team/wevo-frontend.git

cd wevo-frontend
```

### 2️⃣ Environment Variables

루트 경로에 `.env.local` 파일을 생성합니다.

```env
VITE_API_BASE_URL=https://api.wevo.kr
```

### 3️⃣ Install Dependencies

```bash
pnpm install
```

### 4️⃣ Start Development Server

```bash
pnpm dev
```

---

# 🔗 API Architecture

> [!IMPORTANT]
> 프로젝트의 API 통신은 아래 공통 아키텍처 규칙을 따릅니다.

| Rule                  | Description                                                        |
| :-------------------- | :----------------------------------------------------------------- |
| 🟢 **Client**         | 일반 요청은 `apiClient`, 토큰 재발급은 `tokenClient`를 사용합니다. |
| 🟢 **Response**       | 응답은 `ApiResponse<T>` 형태를 따릅니다.                          |
| 🟢 **Parsing**        | `unwrapApiResponse()`를 통해 데이터를 검증하고 추출합니다.         |
| 🟢 **Error Handling** | `getApiErrorMessage()`를 통해 서버 에러를 표준화합니다.            |
| 🟢 **Server State**   | TanStack Query를 기반으로 서버 상태를 관리합니다.                  |
| 🟢 **Token**          | 토큰은 `tokenStorage`를 통해 일관되게 관리합니다.                  |

---

# 📂 Project Structure

```text
wevo-frontend/
│
├── AGENTS.md
├── public
│   └── Wevo-logo.svg
├── src
│   ├── app
│   │   ├── layouts
│   │   ├── router
│   │   └── styles
│   ├── features
│   │   ├── ai
│   │   ├── auth
│   │   ├── export
│   │   ├── onboarding
│   │   ├── project
│   │   └── workspace
│   ├── pages
│   │   ├── auth
│   │   ├── common
│   │   ├── completed
│   │   ├── onboarding
│   │   ├── project
│   │   └── workspace
│   ├── shared
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── styles
│   │   ├── types
│   │   └── utils
│   ├── stores
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

<details>

<summary><strong>📁 전체 폴더 구조 보기</strong></summary>

```text
wevo-frontend/
├─ AGENTS.md
├─ eslint.config.js
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ src/
│  ├─ app/
│  │  ├─ layouts/
│  │  ├─ router/
│  │  └─ styles/
│  ├─ features/
│  │  ├─ ai/
│  │  ├─ auth/
│  │  ├─ export/
│  │  ├─ onboarding/
│  │  ├─ project/
│  │  └─ workspace/
│  ├─ pages/
│  │  ├─ auth/
│  │  ├─ common/
│  │  ├─ completed/
│  │  ├─ onboarding/
│  │  ├─ project/
│  │  └─ workspace/
│  ├─ shared/
│  ├─ stores/
│  ├─ App.tsx
│  ├─ App.css
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ public/
├─ README.md
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vercel.json
└─ vite.config.ts
```

</details>

---

# 🌿 Git Convention

## 🌱 Branch Naming

```text
type/issue-feature
```

예시

```text
feat/79-login
fix/84-bookmark
refactor/15-auth
```

---

## 🏷 GitHub Labels

| Label            | Description                |
| :--------------- | :------------------------- |
| ✨ feature       | 새로운 기능                |
| 🚀 enhancement   | 기존 기능 개선             |
| ♻️ refactor      | 리팩토링                   |
| 🐛 bug           | 버그 수정                  |
| 🎨 design        | UI 및 스타일 수정          |
| 📝 documentation | 문서 수정                  |
| 🔧 chore         | 프로젝트 설정 및 기타 작업 |
| ✅ test          | 테스트 코드                |
| ⏪ revert        | 이전 변경 사항 복구        |

---

## 💬 Commit Convention

```text
type: description (#issue)
```

예시

```text
feat: 프로젝트 생성 API 연동 (#51)

fix: OAuth 로그인 오류 수정 (#62)

docs: README 수정 (#14)

refactor: API 구조 개선 (#23)
```

---

## 🚀 Pull Request

PR은 프로젝트 템플릿을 사용하며 아래 내용을 포함합니다.

- 📌 Related Issue
- 🏷 PR Type
- 📝 Description
- 📸 Screenshot
- ✅ Checklist
- 📎 Reference

---

# 👥 Team

| Member    | Role |
| :-------- | :--- |
| 👤 구다연 | 계정 설정 팝업 및 사용자 프로필 관리 |
| 👤 신연우 | 배포 설정, 작업보드-검토·확정 |
| 👤 유금진 | 초기세팅, 작업보드-레이아웃, 작업보드-의견 모으기 |
| 👤 장현빈 | 초기세팅, 온보딩·사이드바, 라우팅 구조, 작업보드-정리·초안|

---

<div align="center">

<img src="./public/Wevo-logo.svg" width="100" />

<h1>
<span style="color:#6D5DFB">WEVO</span>
</h1>

<h3>
AI 기반 대학생 팀 프로젝트 협업 플랫폼
</h3>

<p>
<span style="color:#94A3B8">
공모전, 팀 프로젝트, 대외활동에서<br />
AI와 함께 아이디어를 모으고, 초안을 생성하고,<br />
팀원과 함께 완성하는 협업 플랫폼

</span>
</p>

</div>
