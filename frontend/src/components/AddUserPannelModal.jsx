import React, { useState, useEffect } from "react";
import { createRole, fetchPermissions } from "../utils/requests";
import { useNavigate } from "react-router-dom";

const AddUserPannelModal = ({ onClose, onAddSuccess }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [groupedPermissions, setGroupedPermissions] = useState({
    plats: [],
    shift: [],
  });
  const [accessLevels, setAccessLevels] = useState({});

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const { plats, shift } = await fetchPermissions();
        setGroupedPermissions({ plats, shift });
      } catch (error) {
        if (error.message === "No token found") {
          navigate("/");
        } else {
          alert("خطای دریافت داده‌ها از سرور");
        }
      }
    };
    loadPermissions();
  }, []);

  const handleAccessChange = (e) => {
    const { name, checked } = e.target;
    setAccessLevels((prevLevels) => ({
      ...prevLevels,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    if (!userRole.trim()) {
      alert("لطفاً نام نقش کاربری را وارد کنید!");
      return;
    }

    // Extract checked keys
    const selectedPermissions = Object.keys(accessLevels).filter(
      (key) => accessLevels[key]
    );

    if (selectedPermissions.length === 0) {
      alert("لطفاً حداقل یک سطح دسترسی انتخاب کنید!");
      return;
    }

    // Convert array to comma separated string
    const roles = selectedPermissions.join(",");

    // Data to be sent to server
    const requestData = {
      name: userRole,
      roles,
    };

    try {
      const response = await createRole(requestData);
      onAddSuccess();
      onClose();
    } catch (error) {
      if (error.message === "No token found") {
        navigate("/");
      } else {
        console.error("Error creating role:", error);
        alert("خطا در ایجاد نقش کاربری");
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50">
      <div className="bg-slate-200 p-6 rounded-lg w-96">
        <h2 className="text-base text-center font-bold mb-4">
          نقش کاربری جدید
        </h2>
        <div className="flex flex-col gap-6 mb-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">نقش کاربری</h3>
            <input
              placeholder="تعریف نقش کاربری"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-[80%] p-2 border rounded-lg border-gray-400 text-sm"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-2">سطوح دسترسی</h3>
            <div className="pr-4 text-xs">
              {/* Platts */}
              <span>مجله Platts</span>
              {groupedPermissions.plats.map((perm) => {
                const key = Object.keys(perm)[0];
                return (
                  <label key={key} className="flex items-center gap-1 ps-4">
                    <input
                      type="checkbox"
                      name={key}
                      checked={accessLevels[key] || false}
                      onChange={handleAccessChange}
                    />
                    {perm[key]}
                  </label>
                );
              })}

              {/* کشیک ارشد */}
              <span>کشیک ارشد</span>
              {groupedPermissions.shift.map((perm) => {
                const key = Object.keys(perm)[0];
                return (
                  <label key={key} className="flex items-center gap-1 ps-4">
                    <input
                      type="checkbox"
                      name={key}
                      checked={accessLevels[key] || false}
                      onChange={handleAccessChange}
                    />
                    {perm[key]}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-300 text-[13px] rounded hover:bg-gray-400"
          >
            بستن
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer px-4 py-2 bg-teal-400 text-[13px] rounded hover:bg-teal-500"
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserPannelModal;
