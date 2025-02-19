import React, { useEffect } from "react";

const PasswordValidator = ({ password, confirmation, onValidationChange }) => {
  const conditions = [
    { label: "حداقل 8 کاراکتر", regex: /.{8,}/ },
    { label: "شامل حروف بزرگ", regex: /[A-Z]/ },
    { label: "شامل حروف کوچک", regex: /[a-z]/ },
    { label: "شامل عدد", regex: /\d/ },
    { label: "شامل علامت", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ];

  const isMatching = password === confirmation;

  const isValid =
    conditions.every((condition) => condition.regex.test(password)) &&
    isMatching;

  useEffect(() => {
    onValidationChange(isValid);
  }, [isValid, onValidationChange]);

  return (
    <ul
      className="text-sm text-nowrap p-2 flex flex-col justify-end h-full"
    >
      {conditions.map((condition, index) => (
        <li
          key={index}
          className={`${
            condition.regex.test(password) ? "text-green-400" : "text-red-400"
          }`}
        >
          {condition.label}
        </li>
      ))}
      <li
        className={`${
          confirmation?.length > 0 && isMatching
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        تطابق رمز عبور و تکرار آن
      </li>
    </ul>
  );
};

export default PasswordValidator;
