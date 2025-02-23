import { jsPDF } from "jspdf";
import "jspdf-autotable";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  excelIcon,
  pdfIcon,
  addIcon,
  deleteIcon,
  editIcon,
} from "../contexts/icons";
import AddUserInfoModal from "./AddUserInfoModal";
import AddUserPannelModal from "./AddUserPannelModal";
import DeleteUserInfoModal from "./DeleteUserInfoModal";
import DeleteUserPannelModal from "./DeleteUserPannelModal";
import EditUserInfoModal from "./EditUserInfoModal";
import EditUserPannelModal from "./EditUserPannelModal";

const EditButtonsList = ({ selectedRow, data }) => {
  const location = useLocation();
  console.log(location);
  const [modals, setModals] = useState({});

  // Map paths to modals and titles
  const routeConfig = {
    "/users/userpanel": {
      addModal: AddUserPannelModal,
      deleteModal: DeleteUserPannelModal,
      editModal: EditUserPannelModal,
      excelTitle: "User roles",
      pdfHeaders: [["name", "roles"]],
      pdfRows: (row) => [row.name, row.roles],
      addLabel: "ایجاد نقش کاربری",
      deleteLabel: "حذف نقش کاربری",
      editLabel: "ویرایش نقش کاربری",
    },
    "/users/userinformation": {
      addModal: AddUserInfoModal,
      deleteModal: DeleteUserInfoModal,
      editModal: EditUserInfoModal,
      excelTitle: "User informations",
      pdfHeaders: [
        ["username", "firstname", "lastname", "email", "phone_number", "role"],
      ],
      pdfRows: (row) => [
        row.username,
        row.firstname,
        row.lastname,
        row.email,
        row.phone_number,
        row.role,
      ],
      addLabel: "ایجاد کاربر جدید",
      deleteLabel: "حذف کاربر",
      editLabel: "ویرایش کاربر",
    },
  };

  const currentRoute = routeConfig[location.pathname] || {};
  console.log(currentRoute);

  // Handle modal visibility
  const toggleModal = (modalType) => {
    setModals((prev) => ({ ...prev, [modalType]: !prev[modalType] }));
  };

  // Handle download Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, currentRoute.excelTitle);
    XLSX.writeFile(wb, `${currentRoute.excelTitle}.xlsx`);
  };

  // Handle print PDF
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    const title = currentRoute.excelTitle;
    const headers = currentRoute.pdfHeaders;
    const rows = data.map(currentRoute.pdfRows);

    doc.text(title, 10, 10);
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20,
    });

    doc.save(`${title}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 w-[4%] bg-[#00a6ff] text-[10px]">
      <button className="cursor-pointer" onClick={handleDownloadExcel}>
        {excelIcon} خروجی اکسل
      </button>
      <button className="cursor-pointer" onClick={handlePrintPDF}>
        {pdfIcon} چاپ
      </button>

      {localStorage.getItem("plats_admin") === "true" && (
        <>
          <button
            className="cursor-pointer"
            onClick={() => toggleModal("addModal")}
          >
            {addIcon}
            {currentRoute?.addLabel || "افزودن"}
          </button>
          <button
            className="cursor-pointer"
            onClick={() =>
              selectedRow
                ? toggleModal("deleteModal")
                : alert("هیچ سطری انتخاب نشده است.")
            }
          >
            {deleteIcon}
            {currentRoute?.deleteLabel || "حذف"}
          </button>
          <button
            className="cursor-pointer"
            onClick={() =>
              selectedRow
                ? toggleModal("editModal")
                : alert("هیچ سطری انتخاب نشده است.")
            }
          >
            {editIcon}
            {currentRoute?.editLabel || "ویرایش"}
          </button>

          {currentRoute?.addModal && modals.addModal && (
            <currentRoute.addModal
              onClose={() => toggleModal("addModal")}
              onAddSuccess={() => window.location.reload()}
            />
          )}
          {currentRoute?.deleteModal && modals.deleteModal && (
            <currentRoute.deleteModal
              selectedRow={selectedRow}
              onClose={() => toggleModal("deleteModal")}
              onDeleteSuccess={() => window.location.reload()}
            />
          )}
          {currentRoute?.editModal && modals.editModal && (
            <currentRoute.editModal
              selectedRow={selectedRow}
              onClose={() => toggleModal("editModal")}
              onEditSuccess={() => window.location.reload()}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EditButtonsList;
