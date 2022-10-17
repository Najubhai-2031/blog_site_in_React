import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const AuthenticationLayout = () => {
  const user = useSelector((state) => state?.user);

  return <div>{!user ? <Outlet /> : <Navigate to="/" />}</div>;
};

export default AuthenticationLayout;
