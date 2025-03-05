import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoutes = () => {
  const user = Cookies.get("token");
  if (!user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
