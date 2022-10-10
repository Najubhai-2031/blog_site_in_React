import React from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";
import Router from "./router";


const App = () => {
  const routing = useRoutes(Router);
  return <>{routing}</>;
};
export default App;
