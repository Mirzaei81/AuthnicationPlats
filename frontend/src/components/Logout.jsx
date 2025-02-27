import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png";
import bg from "/bg.jpg";
import Cookies from "js-cookie";

export const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("token");

    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div>
        <img className="mx-auto h-24 w-auto" src={logo} alt="logo" />
        <div className="my-2 bg-[#1f1f1f] rounded-lg">
          <h1 className="text-center text-lg font-bold text-gray-100 bg-[#111111] rounded-t-lg py-6 px-10">
            Platts
          </h1>
          <p className="py-6 px-10 text-center text-vazir text-gray-600">
            شما با موفقیت خارج شدید
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logout;
