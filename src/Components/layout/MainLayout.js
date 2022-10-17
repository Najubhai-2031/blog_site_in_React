import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Header from "../Header";

const MainLayout = () => {
  const user = useSelector((state) => state?.user);
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
