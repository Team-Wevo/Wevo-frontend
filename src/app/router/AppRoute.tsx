import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { OnBoardingPage } from "../../pages/OnBoardingPage";

import MainLayout from "../layouts/MainLayout";
import ListLayout from "../layouts/ListLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import ProjectListPage from "../../pages/ProjectListPage";
import CompletedListPage from "../../pages/CompletedListPage";
import ProjectDetailPage from "../../pages/ProjectDetailPage";
import CompletedDetailPage from "../../pages/CompletedDetailPage";

export const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
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
              element={<ListLayout />}
            >
              <Route
                index
                element={
                  <Navigate
                    to="project"
                    replace
                  />
                }
              />
              <Route
                path="project"
                element={<ProjectListPage />}
              />
              <Route
                path="completed"
                element={<CompletedListPage />}
              />
            </Route>

            <Route
              path="/project/:id"
              element={<ProjectDetailPage />}
            />
            <Route
              path="/completed/:id"
              element={<CompletedDetailPage />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
