import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnBoardingPage } from "../pages/OnBoardingPage";

export const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 비로그인 상태 온보딩 진입점 */}
        <Route
          path="/"
          element={<OnBoardingPage isLoggedIn={false} />}
        />
        {/* 로그인 상태 온보딩 진입점 */}
        <Route
          path="/home"
          element={<OnBoardingPage isLoggedIn={true} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
