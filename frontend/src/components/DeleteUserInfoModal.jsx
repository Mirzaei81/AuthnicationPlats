import React from "react";
import { deleteUser } from "../utils/requests";
import { useNavigate } from "react-router-dom";

const DeleteUserInfoModal = ({ onClose, selectedRow, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteUser(selectedRow.username);
      onDeleteSuccess();
      onClose();
    } catch (error) {
      if (error.message === "No token found") {
        navigate("/");
      } else {
        console.error("Error deleting user:", error);
        alert("مشکلی در حذف کاربر رخ داد");
      }
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
      <div className="bg-slate-200 rounded p-6 w-1/3">
        <h2 className="font-bold text-base mb-4">تایید حذف</h2>
        <p className="text-sm text-gray-800 mb-6">
          آیا از حذف کاربر {selectedRow.username} مطمئن هستید؟
        </p>
        <div className="text-sm flex justify-between gap-4">
          <button
            className="cursor-pointer bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            انصراف
          </button>
          <button
            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserInfoModal;
