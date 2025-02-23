import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUser, fetchRoles } from "../utils/requests";
import PasswordValidator from "./PasswordValidator";

const AddUserInfoModal = ({ onClose, onAddSuccess }) => {
  const navigate = useNavigate();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [roles, setRoles] = useState([]);

  const { register, handleSubmit, control } = useForm();

  const formFields = [
    { name: "firstname", label: "نام", type: "text" },
    { name: "lastname", label: "نام خانوادگی", type: "text" },
    { name: "username", label: "نام کاربری", type: "text" },
    { name: "phone_number", label: "شماره تلفن", type: "text" },
    { name: "email", label: "ایمیل", type: "email" },
    { name: "password", label: "رمز عبور", type: "password" },
    { name: "confirmPassword", label: "تکرار رمز عبور", type: "password" },
  ];

  useEffect(() => {
    const getRoles = async () => {
      try {
        const fetchedData = await fetchRoles();
        setRoles(fetchedData);
      } catch (error) {
        if (error.message === "No token found") {
          navigate("/");
        } else {
          alert("خطای دریافت داده از سرور");
        }
      }
    };

    getRoles();
  }, []);

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
    defaultValue: "",
  });
  const roleName = useWatch({ control, name: "role", defaultValue: "" }); // Watch selected role name

  const onSubmit = async (data) => {
    if (!isPasswordValid) return;

    const userData = {
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      phone_number: data.phone_number,
      email: data.email,
      password: data.password,
      is_superuser: false, // default
      roleName: roleName,
    };

    try {
      const response = await createUser(userData);
      onAddSuccess();
      onClose();
    } catch (error) {
      if (error.message === "No token found") {
        navigate("/");
      } else {
        console.error("Error creating user:", error);
        alert("خطا در ایجاد کاربر");
      }
      onClose();
    }
  };

  const renderInputField = (name, label, type) => (
    <div key={name} className="relative w-full mb-4">
      <input
        type={type}
        {...register(name, { required: true })}
        placeholder=" "
        className="w-full p-2 bg-slate-100 border-2 border-black rounded-lg text-sm focus:outline-none focus:border-black transition-all duration-200"
      />
      <label
        htmlFor={name}
        className={`absolute right-3 px-1 bg-slate-100 text-sm transition-all duration-200 ${
          useWatch({ control, name, defaultValue: "" })
            ? "-top-2 text-black font-bold"
            : "top-2 text-gray-500"
        }`}
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
      <div className="bg-slate-100 p-6 rounded-lg w-96 ">
        <h2 className="text-base text-start font-bold mb-4">
          ایجاد کاربر جدید
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full">
            <div className="flex flex-col items-start gap-2 mb-4 w-full">
              {formFields.map((field) =>
                renderInputField(field.name, field.label, field.type)
              )}
              <div className="relative w-full mb-4">
                <select
                  className="w-full bg-slate-100 py-1.5 px-2 rounded-lg border-2 border-black text-sm focus:outline-none"
                  style={{
                    color: "#6b7280",
                  }}
                  {...register("role", {
                    required: true,
                    onChange: (e) => {
                      e.target.style.color = "black";
                    },
                  })}
                  defaultValue=""
                >
                  <option
                    style={{
                      color: "#6b7280",
                    }}
                    value=""
                    disabled
                  >
                    نقش کاربری
                  </option>
                  {roles.map((role, index) => (
                    <option
                      key={index}
                      style={{
                        color: "black",
                      }}
                      value={role.name}
                    >
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pb-6">
              <PasswordValidator
                password={password}
                confirmation={confirmPassword}
                onValidationChange={setIsPasswordValid}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 bg-gray-300 text-[13px] rounded hover:bg-gray-400"
            >
              بستن
            </button>
            <button
              type="submit"
              className={`cursor-pointer px-4 py-2 disabled:bg-teal-400 rounded text-[13px] ${
                isPasswordValid
                  ? "bg-teal-400 hover:bg-teal-500"
                  : "bg-gray-400"
              }`}
              disabled={!isPasswordValid}
            >
              ثبت کاربر جدید
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserInfoModal;
