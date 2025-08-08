import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import UserDetails from "../pages/User/UserDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import EditProfile from "../pages/User/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "user", element: <UserDetails /> },
      { path: "user/edit", element: <EditProfile /> },

      // { path: "blog", element: <Blog /> },
      // { path: "contact", element: <Contact /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Register /> },
  // { path: "/login", element: <Login /> },
  // { path: "/register", element: <Register /> },
  // { path: "*", element: <NotFound /> }, // fallback nếu không có route khớp
]);

export default router;
