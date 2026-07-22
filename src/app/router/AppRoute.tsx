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

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
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
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "home",
            element: <OnBoardingPage isLoggedIn={true} />,
          },
          listRoute,
          {
            path: "project/:id",
            element: <ProjectDetailPage />,
          },
          {
            path: "completed/:id",
            element: <CompletedDetailPage />,
          },
          workspaceRoute,
        ],
      },
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
