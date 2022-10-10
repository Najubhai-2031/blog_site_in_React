import React from "react";
import { Outlet } from "react-router";

const AuthenticationLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthenticationLayout;
