import AuthenticationLayout from "../Components/layout/AuthenticationLayout";
import MainLayout from "../Components/layout/MainLayout";
import Profile from "../pages/profile/Profile";
import ForgotPass from "../pages/forgotPass";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import AboutUs from "../pages/aboutUs/AboutUs";
import BlogDetails from "../pages/blogDetails/BlogDetails";
import BlogCard from "../Components/BlogCard";
import Users from "../pages/users";
import Admin from "../Components/layout/Admin";
import Dashboard from "../pages/Dashboard";

const Router = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/Profile/:uid", element: <Profile /> },
      { path: "/Blog/:id", element: <BlogDetails /> },
      { path: "/AboutUs", element: <AboutUs /> },
      { path: "/BlogCard", element: <BlogCard /> },
      { path: "/Users", element: <Users /> },
    ],
  },
  {
    path: "auth",
    element: <AuthenticationLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgotepassword", element: <ForgotPass /> },
    ],
  },
  {
    path: "admin",
    element: <Admin />,
    children: [{ path: "dashboard", element: <Dashboard /> }],
  },
];

export default Router;
