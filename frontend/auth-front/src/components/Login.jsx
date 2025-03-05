import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from "/logo.png";
import bg from "/bg.jpg";
import { loginRequest } from "../utils/authRequests";
import Cookies from "js-cookie";
import { DOMAIN } from "../constants/domain";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedUsername && savedPassword) {
      setValue("username", savedUsername);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      setLoading(true);

      // Save information if option is selected
      if (rememberMe) {
        localStorage.setItem("savedUsername", data.username);
        localStorage.setItem("savedPassword", data.password);
      } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("savedPassword");
      }

      const response = await loginRequest(data);
      Cookies.set("token", response.data.access, {
        domain: DOMAIN, // Domain for access between ports
        path: "/", // All paths are accessible
        expires: 7, // 7 days validity
        sameSite: "None",
        secure: true,
      });
      Cookies.set("refresh", response.data.refresh, {
        domain: DOMAIN,
        path: "/",
        expires: 7,
        sameSite: "None",
        secure: true,
      });

      // Store tokens and roles in cookies
      Cookies.set("plats_admin", response.data.plats_admin, {
        domain: DOMAIN,
        path: "/",
        expires: 7,
        sameSite: "None",
        secure: true,
      });
      Cookies.set("plats_readonly", response.data.plats_readonly, {
        domain: DOMAIN,
        path: "/",
        expires: 7,
        sameSite: "None",
        secure: true,
      });
      Cookies.set(
        "shift_supervisor_tank",
        response.data.shift_supervisor_tank,
        {
          domain: DOMAIN,
          path: "/",
          expires: 7,
          sameSite: "None",
          secure: true,
        }
      );
      Cookies.set("shift_supervisor_btx", response.data.shift_supervisor_btx, {
        domain: DOMAIN,
        path: "/",
        expires: 7,
        sameSite: "None",
        secure: true,
      });
      Cookies.set(
        "shift_supervisor_admin",
        response.data.shift_supervisor_admin,
        {
          domain: DOMAIN,
          path: "/",
          expires: 7,
          sameSite: "None",
          secure: true,
        }
      );
      Cookies.set("shift_supervisor_px", response.data.shift_supervisor_px, {
        domain: DOMAIN,
        path: "/",
        expires: 7,
        sameSite: "None",
        secure: true,
      });
      Cookies.set(
        "shift_supervisor_reforming",
        response.data.shift_supervisor_reforming,
        {
          domain: DOMAIN,
          path: "/",
          expires: 7,
          sameSite: "None",
          secure: true,
        }
      );
      navigate("/users");
    } catch (error) {
      setErrorMessage(
        error.response?.status === 401
          ? "نام کاربری یا رمز عبور اشتباه است"
          : "خطایی رخ داده است. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div>
        <img className="mx-auto h-24 w-auto" src={logo} alt="logo" />
        <div className="my-2 mx-auto w-96 bg-[#1f1f1f] rounded-lg">
          <h1 className="text-center text-lg font-bold text-gray-100 bg-[#111111] rounded-t-lg p-6">
            Platts
          </h1>
          <h2 className="pt-6 text-center text-base font-bold text-gray-100">
            ورود کاربر
          </h2>
          <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <input
                type="text"
                {...register("username", { required: true })}
                id="username"
                className={`w-full bg-[#111111] rounded-t-md px-3 py-3 text-gray-100 outline-none placeholder:text-gray-600 text-sm ps-10 p-2.5 ${
                  errors.username && "border border-red-400"
                }`}
                placeholder="نام کاربری"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                {...register("password", { required: true })}
                id="password"
                className={`w-full bg-[#111111] border-t border-t-gray-800 rounded-b-md px-3 py-3 outline-none text-gray-100 placeholder:text-gray-500 text-sm ps-10 p-2.5 ${
                  errors.password && "border border-red-400"
                }`}
                placeholder="••••••••"
              />
            </div>

            <div className="cursor-pointer flex items-center justify-center mt-6">
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-300"
              >
                ذخیره رمز عبور
              </label>
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5"
              />
            </div>

            <div>
              <button
                disabled={loading}
                type="submit"
                className="cursor-pointer flex items-center gap-2 w-full my-6 justify-center rounded-md bg-sky-600 hover:bg-sky-700 px-3 py-1.5 text-sm text-white"
              >
                ورود
                {loading && (
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 text-gray-200 animate-spin fill-sky-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/forgetpassword")}
                className="cursor-pointer text-sm text-gray-300 hover:text-gray-400"
              >
                فراموشی رمز عبور
              </button>
            </div>
            {errorMessage && (
              <div className="text-center">
                <span className="text-sm text-red-400">{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
