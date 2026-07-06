import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnBoardingPage } from "../pages/onBoardingPage";

export const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<OnBoardingPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};
