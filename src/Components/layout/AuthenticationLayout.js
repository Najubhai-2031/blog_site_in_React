import React from "react";
import { Navigate, Outlet } from "react-router";

const AuthenticationLayout = () => {
  const user = localStorage.getItem("user");

  return <div>{!user ? <Outlet /> : <Navigate to="/" />}</div>;
};

export default AuthenticationLayout;
