import AllProfiles from "../Components/UserProfile";
import BlogDetails from "../Components/BlogDetails";
import AuthenticationLayout from "../Components/layout/AuthenticationLayout";
import MainLayout from "../Components/layout/MainLayout";
import Profile from "../Components/Profile";
import ForgotPass from "../pages/forgotPass";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import AboutUs from "../Components/AboutUs";

const Router = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "Profile/:uid", element: <Profile /> },
      { path: "/Blog/:id", element: <BlogDetails /> },
      { path: "/AllProfiles/:uid", element: <AllProfiles /> },
      { path: "AboutUs", element: <AboutUs /> },
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
];

export default Router;
