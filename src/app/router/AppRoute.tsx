import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  workspaceIndexLoader,
  workspaceSectionLoader,
} from "./loaders/workspaceLoaders";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../../pages/common/ErrorPage";
import NotFoundPage from "../../pages/common/NotFoundPage";
import { OnBoardingPage } from "../../pages/onboarding/OnBoardingPage";
import CompletedDetailPage from "../../pages/completed/CompletedDetailPage";
import CompletedListPage from "../../pages/completed/CompletedListPage";
import ProjectDetailPage from "../../pages/project/ProjectDetailPage";
import ProjectListPage from "../../pages/project/ProjectListPage";
import WorkspacePage from "../../pages/workspace/WorkspacePage";
import OAuthCallbackPage from "../../pages/auth/OAuthCallbackPage";
import InvitePage from "../../pages/invite/InvitePage";

const listRoute: RouteObject = {
  path: "list",
  children: [
    {
      index: true,
      loader: () => redirect("/list/project"),
    },
    {
      path: "project",
      element: <ProjectListPage />,
    },
    {
      path: "completed",
      element: <CompletedListPage />,
    },
  ],
};

const workspaceRoute: RouteObject = {
  path: "workspace/:projectId",
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      loader: workspaceIndexLoader,
    },
    {
      path: "sections/:sectionNo",
      loader: workspaceSectionLoader,
      element: <WorkspacePage />,
    },
  ],
};

const protectedMainRoute: RouteObject = {
  element: <ProtectedRoute />,
  children: [
    {
      path: "home",
      element: <OnBoardingPage isLoggedIn={true} />,
    },
    {
      path: "project/:id",
      element: <ProjectDetailPage />,
    },
  ],
};

const protectedWorkspaceRoute: RouteObject = {
  element: <ProtectedRoute />,
  errorElement: <ErrorPage />,
  children: [workspaceRoute],
};

// 완성본 상세는 워크스페이스처럼 자체 헤더·사이드바를 가진 화면이라, MainLayout의
// 메인 사이드바가 겹치지 않도록 MainLayout 밖(워크스페이스와 같은 레벨)에 둔다.
const protectedCompletedDetailRoute: RouteObject = {
  element: <ProtectedRoute />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "completed/:id",
      element: <CompletedDetailPage />,
    },
  ],
};

const routes: RouteObject[] = [
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "oauth/callback/:provider",
        element: <OAuthCallbackPage />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            element: <GuestRoute />,
            children: [
              {
                index: true,
                element: <OnBoardingPage isLoggedIn={false} />,
              },
            ],
          },
          // 비로그인도 목록 화면을 둘러볼 수 있도록 보호 라우트 밖에 둔다.
          listRoute,
          // 초대 링크는 비로그인 사용자도 들어올 수 있어야 하므로 보호 라우트 밖에 둔다.
          // 로그인 여부에 따른 안내는 InvitePage 내부에서 처리한다.
          {
            path: "invite/:token",
            element: <InvitePage />,
          },
          protectedMainRoute,
        ],
      },
      protectedWorkspaceRoute,
      protectedCompletedDetailRoute,
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes);

export const AppRoute = () => {
  return <RouterProvider router={router} />;
};
