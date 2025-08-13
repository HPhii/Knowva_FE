import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import UserDetails from "../pages/User/UserDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Explore from "../pages/Explore/Explore";
import Quiz from "../pages/Quiz/Quiz";
import Flashcard from "../pages/Flashcard/Flashcard";
import Test from "../pages/Test/Test";
import Pricing from "../pages/Pricing/Pricing";
import Support from "../pages/Support/Support";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Blog from "../pages/Blog/Blog";
import PostBlog from "../pages/Blog/PostBlog";
import BlogDetail from "../pages/Blog/BlogDetail";
import Terms from "../pages/Terms/Terms";
import Privacy from "../pages/Privacy/Privacy";
import Documentation from "../pages/Documentation/Documentation";
import Cookies from "../pages/Cookies/Cookies";
import EditProfile from "../pages/User/EditProfile";
import VerifyEmail from "../pages/User/VerifyEmail";
import VerifyComplete from "../pages/User/VerifyComplete";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "user", element: <UserDetails /> },
      { path: "explore", element: <Explore /> },
      { path: "quizzes", element: <Quiz /> },
      { path: "flashcards", element: <Flashcard /> },
      { path: "tests", element: <Test /> },
      { path: "pricing", element: <Pricing /> },
      { path: "support", element: <Support /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/create", element: <PostBlog /> },
      { path: "blog/:slug", element: <BlogDetail /> },
      { path: "terms", element: <Terms /> },
      { path: "privacy", element: <Privacy /> },
      { path: "documentation", element: <Documentation /> },
      { path: "cookies", element: <Cookies /> },
      // 
      { path: "user/edit", element: <EditProfile /> },

      // { path: "blog", element: <Blog /> },
      // { path: "contact", element: <Contact /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Register /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "verify-email", element: <VerifyEmail /> },
  { path: "verify-complete", element: <VerifyComplete /> },
  // { path: "/login", element: <Login /> },
  // { path: "/register", element: <Register /> },
  // { path: "*", element: <NotFound /> }, // fallback nếu không có route khớp
]);

export default router;
