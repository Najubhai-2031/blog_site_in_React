import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const AuthenticationLayout = () => {
  const user = useSelector((state) => state?.user?.user);

  return <div>{user === null ? <Outlet /> : <Navigate to="/" />}</div>;
};

export default AuthenticationLayout;
