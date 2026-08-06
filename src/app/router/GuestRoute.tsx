import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../shared/api/tokenStorage";

const GuestRoute = () => {
  const isAuthenticated = Boolean(getAccessToken());

  if (isAuthenticated) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return <Outlet />;
};

export default GuestRoute;
