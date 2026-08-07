import { createContext, useContext } from "react";

export interface MainLayoutContextValue {
  isLoggedIn: boolean;
  openLoginModal: () => void;
}

/**
 * Outlet context 대신 일반 컨텍스트를 쓴다.
 * GuestRoute·ProtectedRoute가 중간에서 `<Outlet />`을 컨텍스트 없이 렌더링하면
 * Outlet context는 undefined로 덮이기 때문이다.
 */
export const MainLayoutContext = createContext<MainLayoutContextValue | null>(
  null,
);

export const useMainLayoutContext = () => {
  const context = useContext(MainLayoutContext);

  if (!context) {
    throw new Error(
      "useMainLayoutContext는 MainLayout 하위에서만 사용할 수 있습니다.",
    );
  }

  return context;
};
