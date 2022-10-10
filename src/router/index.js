import BlogDetails from "../Components/BlogDetails";
import AuthenticationLayout from "../Components/layout/AuthenticationLayout";
import MainLayout from "../Components/layout/MainLayout";
import Profile from "../Components/Profile";
import ForgotPass from "../pages/forgotPass";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";

const Router = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "Profile", element: <Profile /> },
      { path: "/Blog/:id", element: <BlogDetails /> },
    ],
  },
  {
    path: "auth",
    element: <AuthenticationLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgotepassword", element: <ForgotPass /> }
    ],
  },
];

export default Router;
