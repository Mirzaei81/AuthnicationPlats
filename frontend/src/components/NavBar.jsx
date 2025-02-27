import React from "react";
import { Link } from "react-router-dom";
import { arrowIcon, offIcon, userIcon1, userIcon2 } from "../assets/icons";

const NavBar = () => {
  const user = localStorage.getItem("token");
  return (
    <div className="flex justify-between bg-gray-300">
      <nav className="flex w-full text-sm">
        <div className="relative group">
          <div className="text-center py-4 flex flex-col gap-1 items-center cursor-pointer px-8 hover:bg-yellow-500 transition-colors duration-300 ease-in-out">
            {userIcon1}
            <span>کاربران</span>
            {arrowIcon}
          </div>
          <div
            dir="rtl"
            className=" z-10 absolute text-xs truncate hidden group-hover:block bg-white border border-gray-300 shadow-md"
          >
            <Link
              to="/users/userinformation"
              className="flex items-end gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {userIcon2}
              <span>اطلاعات کاربری</span>
            </Link>
            <Link
              to="/users/userpanel"
              className="flex items-end gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {userIcon2}
              <span>نقش کاربری</span>
            </Link>
          </div>
        </div>
      </nav>
      {user && (
        <button className="ml-10 text-sm">
          <div className="flex flex-col justify-center items-center">
            {offIcon}
            <Link className="pt-1" to="/logout">
              خروج
            </Link>
          </div>
        </button>
      )}
    </div>
  );
};

export default NavBar;
