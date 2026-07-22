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
import {
  DEFAULT_WORKSPACE_SECTION,
  isWorkspaceSection,
} from "../../features/workspace/constants/sections";
import {
  DEFAULT_WORKSPACE_DOCUMENT_TYPE,
  isWorkspaceDocumentType,
} from "../../features/workspace/constants/documentTypes";

const workspaceRouteLoader = ({
  params,
}: {
  params: Record<string, string | undefined>;
}) => {
  const projectId = params.projectId;
  const documentType = params.documentType;
  const section = params.section;

  if (!projectId) {
    return redirect("/list/project");
  }

  const safeDocumentType = isWorkspaceDocumentType(documentType)
    ? documentType
    : DEFAULT_WORKSPACE_DOCUMENT_TYPE;

  const safeSection = isWorkspaceSection(section)
    ? section
    : DEFAULT_WORKSPACE_SECTION;

  if (documentType !== safeDocumentType || section !== safeSection) {
    return redirect(
      `/workspace/${projectId}/${safeDocumentType}/${safeSection}`,
    );
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
          path="/workspace/:projectId/:documentType/:section"
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
