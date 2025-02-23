import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserPermissions } from "../utils/requests";
import EditButtonsList from "./EditButtonsList";
import NavBar from "./NavBar";

export const UserPanel = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const getUserPermissions = async () => {
      try {
        const fetchedData = await fetchUserPermissions();
        setData(fetchedData);
      } catch (error) {
        if (error.message === "No token found") {
          navigate("/");
        } else {
          alert("خطای دریافت داده از سرور");
        }
      }
    };

    getUserPermissions();
  }, []);

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  return (
    <div className="flex">
      <EditButtonsList selectedRow={selectedRow} data={data} />
      <div className="w-[96%]">
        <NavBar />
        <div className="border border-gray-300">
          <div className="bg-[#00a5ff91] p-2 flex gap-2 justify-center items-center px-10">
            <span>پنل کاربری</span>
          </div>
          <div>
            <div className="flex flex-col px-72 justify-center">
              <div className="bg-green-400 text-center font-bold p-4 border border-gray-300">
                <p className="text-sm">پنل کاربری</p>
              </div>
              <table
                id="product-table"
                className="text-xs border-collapse border border-gray-300 mb-10"
              >
                <thead className="py-4">
                  <tr className="bg-teal-400 border border-gray-300 p-1">
                    <th className="text-center border border-gray-300 p-1">
                      نقش کاربری
                    </th>
                    <th className="text-center border border-gray-300 p-1">
                      سطح دسترسی
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer ${
                        selectedRow.name === row.name
                          ? "bg-[#f8d795]"
                          : "odd:bg-[#FFE4AF] even:bg-[#FEECCB]"
                      }`}
                      onClick={() => handleRowClick(row)}
                    >
                      <td className="text-center border border-gray-300 p-1">
                        {row.name}
                      </td>
                      <td className="text-center border border-gray-300 p-1">
                        {row.roles.split(",").map((item, index) => (
                          <span key={index}>
                            {item}
                            <br />
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
