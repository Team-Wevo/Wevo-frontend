import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../shared/api/tokenStorage";

const ProtectedRoute = () => {
  const isAuthenticated = Boolean(getAccessToken());

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
