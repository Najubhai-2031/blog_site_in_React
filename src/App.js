import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import "./App.css";
import Router from "./router";
import { authState } from "./store/user/action";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authState());
  }, []);

  const routing = useRoutes(Router);
  return <>{routing}</>;
};
export default App;
