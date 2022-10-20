import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";

const Admin = () => {
  const user = useSelector((state) => state?.user?.user);

  return (
    <div>
      {user?.role === "admin" && user !== null ? (
        <>
          <AdminHeader />
          <AdminSidebar />
          <Outlet />
        </>
      ) : (
        <Navigate to="/auth/login" />
      )}
    </div>
  );
};

export default Admin;
