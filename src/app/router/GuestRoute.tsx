import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));

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
