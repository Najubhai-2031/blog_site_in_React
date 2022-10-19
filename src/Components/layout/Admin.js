import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import AdminHeader from "../AdminHeader";

const Admin = () => {
  const user = useSelector((state) => state?.user?.user);

  return (
    <div>
      {user?.role === "admin" && user !== null ? (
        <>
          <AdminHeader />
          <Outlet />
        </>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </div>
  );
};

export default Admin;
