import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsersInformations } from "../utils/requests";
import EditButtonsList from "./EditButtonsList";
import NavBar from "./NavBar";

export const UserInformation = () => {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const getUsersInformations = async () => {
      try {
        const fetchedData = await fetchUsersInformations();
        setData(fetchedData);
      } catch (error) {
        if (error.message === "No token found") {
          navigate("/");
        } else {
          alert("خطای دریافت داده از سرور");
        }
      }
    };

    getUsersInformations();
  }, []);

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };
  console.log(data);
  return (
    <div className="flex">
      <EditButtonsList selectedRow={selectedRow} data={data} />
      <div className="w-[96%]">
        <NavBar />
        <div className="border border-gray-300">
          <div className="bg-[#00a5ff91] p-2 flex gap-2 justify-center items-center px-10">
            <span>اطلاعات کاربری</span>
          </div>
          <div>
            <div className="flex flex-col px-72 justify-center">
              <div className="bg-green-400 text-center font-bold p-4 border border-gray-300">
                <p className="text-sm">اطلاعات کاربری</p>
              </div>
              <table
                id="product-table"
                className="text-xs border-collapse border border-gray-300 mb-10"
              >
                <thead className="py-4">
                  <tr className="bg-teal-400 border border-gray-300 p-1">
                    <th className="text-center border border-gray-300 p-1">
                      نام کاربری
                    </th>
                    <th className="text-center border border-gray-300 p-1">
                      نام
                    </th>
                    <th className="text-center border border-gray-300 p-1">
                      نام خانوادگی
                    </th>
                    <th className="text-center border border-gray-300 p-1">
                      ایمیل
                    </th>
                    <th className="text-center border border-gray-300 p-1">
                      تلفن
                    </th>
                    <th className="text-center border border-gray-300 p-1">
                      نقش کاربری
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr
                      key={row.username}
                      className={`cursor-pointer ${
                        selectedRow.username === row.username
                          ? "bg-[#f8d795]"
                          : "odd:bg-[#FFE4AF] even:bg-[#FEECCB]"
                      }`}
                      onClick={() => handleRowClick(row)}
                    >
                      <td className="text-center border border-gray-300 p-1">
                        {row.username}
                      </td>
                      <td className="text-center border border-gray-300 p-1">
                        {row.firstname}
                      </td>
                      <td className="text-center border border-gray-300 p-1">
                        {row.lastname}
                      </td>
                      <td className="text-center border border-gray-300 p-1">
                        {row.email}
                      </td>
                      <td className="text-center border border-gray-300 p-1">
                        {row.phone_number}
                      </td>
                      <td className="text-center border border-gray-300 p-1">
                        {row.role}
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

export default UserInformation;
