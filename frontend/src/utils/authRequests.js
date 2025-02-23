import axios from "axios";

export const loginRequest = async (data) => {
  try {
    const response = await axios.post("/api/login/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestOtp = async (method, value) => {
  try {
    const response = await axios.post("/api/code/", {
      [method === "sms" ? "phone_number" : "email"]: value,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (method, value, otp) => {
  try {
    const response = await axios.post("/api/valid/", {
      [method === "sms" ? "phone_number" : "email"]: value,
      code: otp,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (phone_number, password, confirmation) => {
  console.log({
    phone_number,
    password,
    confirmation,
  });
  try {
    const response = await axios.post("/api/reset/", {
      phone_number,
      password,
      confirmation,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("خطایی رخ داده است. لطفاً دوباره امتحان کنید.");
    }
  }
};
