import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import Router from "./router";

const App = () => {
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.remove("user");
      }
    });
  }, []);

  const routing = useRoutes(Router);
  return <>{routing}</>;
};
export default App;
