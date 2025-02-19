import Login from "../components/Login";
import ForgetPassword from "../components/ForgetPassword";
import NewPassword from "../components/NewPassword";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  { path: "/forgetpassword", element: <ForgetPassword /> },
  { path: "/newpassword", element: <NewPassword /> },
]);
