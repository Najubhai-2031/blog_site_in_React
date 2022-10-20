import AuthenticationLayout from "../Components/layout/AuthenticationLayout";
import MainLayout from "../Components/layout/MainLayout";
import Profile from "../pages/user/profile/Profile";
import ForgotPass from "../pages/user/forgotPass";
import Home from "../pages/user/home";
import Login from "../pages/user/login";
import Register from "../pages/user/register";
import AboutUs from "../pages/user/aboutUs/AboutUs";
import BlogDetails from "../pages/user/blogDetails/BlogDetails";
import BlogCard from "../Components/BlogCard";
import FindUsers from "../pages/user/findUsers";
import Admin from "../Components/layout/Admin";
import Dashboard from "../pages/admin/Dashboard";
import BlogsForAdmin from "../pages/admin/Dashboard/blogs";
import UsersInfoForAdmin from "../pages/admin/Dashboard/usersInfo";
import CommentsForAdmin from "../pages/admin/Dashboard/comments";

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
      { path: "/Users", element: <FindUsers /> },
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
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "blogs", element: <BlogsForAdmin /> },
      { path: "users", element: <UsersInfoForAdmin /> },
      { path: "Comments", element: <CommentsForAdmin /> },
    ],
  },
];

export default Router;
