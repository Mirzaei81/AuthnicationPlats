import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import PasswordValidator from "./PasswordValidator";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import  logo from  "/logo.png"
import  bg from  "/bg.jpg"

const NewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phone_number = location.state?.phone_number || "";
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const confirmation = useWatch({
    control,
    name: "confirmation",
    defaultValue: "",
  });

  const onSubmit = async (data) => {
    if (!isPasswordValid) {
      return;
    }
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await axios.post("/api/auth/reset/", {
        ...data,
        phone_number,
      });

      navigate("/login");
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("خطایی رخ داده است. لطفاً دوباره امتحان کنید.");
      }
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
        <div className="my-2 pb-1 mx-auto w-96 bg-[#1f1f1f] rounded-lg">
          <h1 className="text-center text-lg font-bold text-gray-100 bg-[#111111] rounded-t-lg p-6">
            Platts
          </h1>
          <h2 className="pt-6 text-center text-base font-bold text-gray-100">
            رمز عبور جدید
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6">
              <div className="flex justify-">
                <div>
                  <div className="relative">
                    <input
                      type="password"
                      {...register("password", { required: true })}
                      id="password"
                      className="w-full bg-[#111111] px-3 py-6 outline-none rounded-tr-md text-gray-100 placeholder:text-gray-500 text-sm ps-10 p-2.5"
                      placeholder="رمز عبور جدید"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      {...register("confirmation", { required: true })}
                      id="confirmation"
                      className="w-full bg-[#111111] border-t border-t-gray-800 rounded-br-md px-3 py-6 outline-none text-gray-100 placeholder:text-gray-500 text-sm ps-10 p-2.5"
                      placeholder="تکرار رمز عبور جدید"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center bg-[#111111] border-r border-gray-800 rounded-bl-md rounded-tl-md">
                  <PasswordValidator
                    onValidationChange={setIsPasswordValid}
                    password={password}
                    confirmation={confirmation}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                disabled={loading}
                type="submit"
                className="flex items-center gap-2 w-[300px] mb-6 mx-auto justify-center rounded-md bg-sky-600 hover:bg-sky-700 px-3 py-1.5 text-sm text-white"
              >
                ثبت رمز عبور جدید
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
            {errorMessage && (
              <div className="text-center mb-4">
                <span className="text-sm text-red-400">{errorMessage}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
