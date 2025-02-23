import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { requestOtp, verifyOtp } from "../utils/authRequests";
import logo from "/logo.png";
import bg from "/bg.jpg";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpFieldOpen, setOtpFieldOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [buttonText, setButtonText] = useState("دریافت کد تایید");
  const [method, setMethod] = useState("sms"); // Default method is SMS
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();
  const navigate = useNavigate();

  const handleOtpClick = async () => {
    const { phone_number, email } = getValues();

    if ((method === "sms" && !phone_number) || (method === "email" && !email))
      return;

    try {
      setLoading(true);
      setButtonText("در حال ارسال کد...");

      // استفاده از تابع requestOtp به جای axios مستقیم
      if (method === "sms") {
        await requestOtp("sms", phone_number);
      } else {
        await requestOtp("email", email);
      }

      setOtpFieldOpen(true);
      if (!timer) startTimer();
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setCountdown(60); // Reset countdown to 60 seconds
    setTimer(
      setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimer(null);
            setButtonText("دریافت مجدد کد تایید");
            return 0;
          }
          return prev - 1;
        });
      }, 1000)
    );
  };

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [timer]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setOtpError("");

      // استفاده از تابع verifyOtp به جای axios مستقیم
      const response = await verifyOtp(
        method,
        method === "sms" ? data.phone_number : data.email,
        data.otp
      );

      if (response.status === 201) {
        navigate("/newpassword", {
          state: {
            [method === "sms" ? "phone_number" : "email"]:
              method === "sms" ? data.phone_number : data.email,
          },
        });
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setOtpError(error.response.data.error);
      } else {
        setOtpError("خطایی رخ داده است. لطفاً دوباره امتحان کنید.");
      }
      reset({ otp: "" });
      setOtpFieldOpen(false);
      setButtonText("دریافت مجدد کد تایید");
      clearInterval(timer);
      setTimer(null);
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
            فراموشی رمز
          </h2>
          <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm flex items-center">
                <input
                  type="radio"
                  value="sms"
                  checked={method === "sms"}
                  onChange={() => setMethod("sms")}
                />
                <span className="ps-2">دریافت کد از طریق پیامک</span>
              </label>
              <label className="text-gray-400 text-sm flex items-center">
                <input
                  type="radio"
                  value="email"
                  checked={method === "email"}
                  onChange={() => setMethod("email")}
                />
                <span className="ps-2">دریافت کد از طریق ایمیل</span>
              </label>
            </div>

            <div className="relative mt-4">
              {method === "sms" ? (
                <input
                  type="text"
                  {...register("phone_number", {
                    required: true,
                  })}
                  id="phone_number"
                  className="w-full bg-[#111111] border-t border-t-gray-800 rounded-md px-3 py-3 outline-none text-gray-100 placeholder:text-gray-500 text-sm ps-10 p-2.5"
                  placeholder="شماره تلفن"
                />
              ) : (
                <input
                  type="email"
                  {...register("email", {
                    required: true,
                  })}
                  id="email"
                  className="w-full bg-[#111111] border-t border-t-gray-800 rounded-md px-3 py-3 outline-none text-gray-100 placeholder:text-gray-500 text-sm ps-10 p-2.5"
                  placeholder="آدرس ایمیل"
                />
              )}
            </div>

            <div className="flex items-center justify-center mt-6">
              <button
                type="button"
                onClick={handleOtpClick}
                className={`cursor-pointer text-white text-sm ${
                  buttonText !== "در حال ارسال کد تایید..." && "underline"
                }`}
                disabled={timer !== null} // Disable button if timer is active
              >
                {buttonText}
              </button>
              {timer && (
                <span className="text-xs text-gray-300 mx-2">
                  ({countdown} ثانیه)
                </span>
              )}
            </div>

            {otpFieldOpen && (
              <div className="flex items-center justify-center mt-6">
                <input
                  type="text"
                  {...register("otp", {
                    required: true,
                  })}
                  id="otp"
                  className="w-1/2 text-center bg-[#111111] rounded-md px-3 py-3 outline-none text-gray-100 placeholder:text-gray-500 text-sm placeholder:text-center border border-gray-800"
                  placeholder="کد تایید را وارد کنید"
                />
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer flex items-center gap-2 w-full my-6 justify-center rounded-md bg-sky-600 hover:bg-sky-700 px-3 py-1.5 text-sm text-white"
              >
                مرحله بعد
              </button>
            </div>
            {otpError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {otpError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
