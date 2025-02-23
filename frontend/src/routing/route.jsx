import Login from "../components/Login";
import ForgetPassword from "../components/ForgetPassword";
import NewPassword from "../components/NewPassword";
import Users from "../components/Users";
import UserPanel from "../components/UserPanel";
import UserInformation from "../components/UserInformation";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Logout from "../components/Logout";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login />,
    },
    { path: "/forgetpassword", element: <ForgetPassword /> },
    { path: "/newpassword", element: <NewPassword /> },
    { path: "/logout", element: <Logout /> },
    {
      element: <PrivateRoutes />,
      children: [
        { path: "/users", element: <Users /> },
        { path: "/users/userpanel", element: <UserPanel /> },
        { path: "/users/userinformation", element: <UserInformation /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
