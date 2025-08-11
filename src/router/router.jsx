import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import UserApp from "../pages/User/UserApp";
import UserDetails from "../pages/User/UserDetails";
import QuizSet from "../pages/User/QuizSet";
import FlashcardSet from "../pages/User/FlashcardSet";
import Transaction from "../pages/User/Transaction";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
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

      // { path: "blog", element: <Blog /> },
      // { path: "contact", element: <Contact /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Register /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "verify-email", element: <VerifyEmail /> },
  { path: "verify-complete", element: <VerifyComplete /> },
  {
    path: "user",
    element: <UserApp />,
    children: [
      { index: true, element: <UserDetails /> },
      { path: "profile", element: <UserDetails /> },
      { path: "quiz-set", element: <QuizSet /> },
      { path: "flashcard-set", element: <FlashcardSet /> },
      { path: "transaction", element: <Transaction /> },
      { path: "edit", element: <EditProfile /> },
    ],
  },
  // { path: "/login", element: <Login /> },
  // { path: "/register", element: <Register /> },
  // { path: "*", element: <NotFound /> }, // fallback nếu không có route khớp
]);

export default router;
