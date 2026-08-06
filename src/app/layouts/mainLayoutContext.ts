import { useOutletContext } from "react-router-dom";

export interface MainLayoutContext {
  isLoggedIn: boolean;
  openLoginModal: () => void;
}

export const useMainLayoutContext = () => useOutletContext<MainLayoutContext>();
