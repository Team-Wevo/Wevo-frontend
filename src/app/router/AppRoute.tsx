import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
} from "react-router-dom";
import { OnBoardingPage } from "../../pages/onboarding/OnBoardingPage";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import ProjectListPage from "../../pages/project/ProjectListPage";
import CompletedListPage from "../../pages/completed/CompletedListPage";
import ProjectDetailPage from "../../pages/project/ProjectDetailPage";
import CompletedDetailPage from "../../pages/completed/CompletedDetailPage";
import NotFoundPage from "../../pages/common/NotFoundPage";
import ErrorPage from "../../pages/common/ErrorPage";
import WorkspacePage from "../../pages/workspace/WorkspacePage";
import { isWorkspaceSection } from "../../features/workspace/constants/sections";

const workspaceRouteLoader = ({
  params,
}: {
  params: Record<string, string | undefined>;
}) => {
  const projectId = params.projectId;
  const section = params.section;

  if (!projectId) {
    return redirect("/list/project");
  }

  if (!isWorkspaceSection(section)) {
    return redirect(`/workspace/${projectId}/background`);
  }

  return null;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<MainLayout />}
      errorElement={<ErrorPage />}
    >
      <Route element={<GuestRoute />}>
        <Route
          path="/"
          element={<OnBoardingPage isLoggedIn={false} />}
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          path="/home"
          element={<OnBoardingPage isLoggedIn={true} />}
        />
        <Route
          path="/list"
          loader={() => redirect("/list/project")}
        />
        <Route
          path="/list/project"
          element={<ProjectListPage />}
        />
        <Route
          path="/list/completed"
          element={<CompletedListPage />}
        />
        <Route
          path="/project/:id"
          element={<ProjectDetailPage />}
        />
        <Route
          path="/completed/:id"
          element={<CompletedDetailPage />}
        />
        <Route
          path="/workspace/:projectId/:section"
          loader={workspaceRouteLoader}
          element={<WorkspacePage />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Route>,
  ),
);

export const AppRoute = () => {
  return <RouterProvider router={router} />;
};
