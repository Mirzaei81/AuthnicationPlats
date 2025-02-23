import React from "react";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoutes = () => {
  const user = localStorage.getItem("token");
  if (!user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
