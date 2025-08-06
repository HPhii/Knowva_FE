import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <Register /> },
        // { path: "blog", element: <Blog /> },
      // { path: "contact", element: <Contact /> },
    ],
  },
  // { path: "/login", element: <Login /> },
  // { path: "/register", element: <Register /> },
  // { path: "*", element: <NotFound /> }, // fallback nếu không có route khớp
]);

export default router;
