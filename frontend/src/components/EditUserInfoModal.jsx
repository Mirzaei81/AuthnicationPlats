import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import PasswordValidator from "./PasswordValidator";
import { editUser, fetchRoles } from "../utils/requests";
import { useNavigate } from "react-router-dom";

const EditUserInfoModal = ({ onClose, selectedRow, onEditSuccess }) => {
  const navigate = useNavigate();
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [roles, setRoles] = useState([]);

  const { register, handleSubmit, control, setValue } = useForm();

  useEffect(() => {
    if (selectedRow) {
      setValue("firstname", selectedRow.firstname);
      setValue("lastname", selectedRow.lastname);
      setValue("username", selectedRow.username);
      setValue("phone_number", selectedRow.phone_number);
      setValue("email", selectedRow.email);

      const validRole = roles.some((role) => role.name === selectedRow.role)
        ? selectedRow.role
        : "";
      setValue("role", validRole);
    }
  }, [selectedRow, setValue]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const fetchedData = await fetchRoles();
        setRoles(fetchedData);
      } catch (error) {
        if (error.response?.status === 401) {
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
      current_password: data.current_password,
    };

    try {
      const response = await editUser(userData);
      onEditSuccess();
      onClose();
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/");
      } else {
        console.error("Error editing user:", error);
        alert("خطا در ویرایش کاربر");
      }
      onClose();
    }
  };

  const renderInputField = (name, label, type, placeholder) => (
    <div className="relative w-full mb-4">
      <input
        type={type}
        {...register(name, { required: true })}
        placeholder={placeholder || " "}
        className="w-full p-2 bg-slate-100 border-2 border-black rounded-lg text-sm focus:outline-none focus:border-black transition-all duration-200"
      />
      <label
        htmlFor={name}
        className="absolute right-3 px-1 bg-slate-100 text-sm transition-all duration-200 -top-2 text-black font-bold"
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0  bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
      <div className="bg-slate-100 p-6 rounded-lg w-96">
        <h2 className="text-base text-start font-bold mb-4">
          ویرایش اطلاعات کاربر
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-end">
            <div className="flex flex-col w-full items-start gap-2 mb-4">
              {renderInputField("firstname", "نام", "text")}
              {renderInputField("lastname", "نام خانوادگی", "text")}
              {renderInputField("username", "نام کاربری", "text")}
              {renderInputField("phone_number", "شماره تلفن", "text")}
              {renderInputField("email", "ایمیل", "email")}
              <div className="relative w-full mb-4">
                <select
                  className="w-full bg-slate-100 py-1.5 px-2 rounded-lg border-2 border-black text-sm focus:outline-none"
                  {...register("role", {
                    required: true,
                    onChange: (e) => {
                      e.target.style.color = "black";
                    },
                  })}
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
              {renderInputField(
                "current_password",
                "رمز عبور فعلی شما",
                "current_password",
                "رمز عبور فعلی خود را وارد کنید"
              )}
              {renderInputField(
                "password",
                "رمز عبور",
                "password",
                "رمز عبور جدید را وارد کنید"
              )}
              {renderInputField(
                "confirmPassword",
                "تکرار رمز عبور",
                "password",
                "رمز عبور جدید را تکرار کنید"
              )}
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
              ویرایش
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserInfoModal;
