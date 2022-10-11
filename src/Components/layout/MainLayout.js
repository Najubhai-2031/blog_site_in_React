import React from "react";
import { Navigate, Outlet } from "react-router";
import Header from "../Header";

const MainLayout = () => {
  const user = localStorage.getItem("user");

  return (
    <div>
      {user ? (
        <>
          <Header />
          <Outlet />
        </>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </div>
  );
};

export default MainLayout;
