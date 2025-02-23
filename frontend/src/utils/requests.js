import axios from "axios";

const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    throw {
      response: { status: 401, data: { message: "No refresh token found" } },
    };
  }

  const response = await axios.post("/login/refresh/", { refresh });
  localStorage.setItem("token", response.data.access);
  return response.data.access;
};

export const fetchUserPermissions = async () => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.get("/api/userPermisions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.get("/api/userPermissions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }

    console.error("Error fetching user permissions:", error);
    throw error;
  }
};

export const fetchUsersInformations = async () => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    console.error("Error fetching user infrormations:", error);
    throw error;
  }
};

export const fetchRoles = async () => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.get("/api/userPermisions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.get("/api/userPermisions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    console.error("Error fetching user infrormations:", error);
    throw error;
  }
};

export const fetchPermissions = async () => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.get("/api/permisions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawPermissions = response.data.permision;

    // Categorize the data
    const plats = rawPermissions.filter((p) =>
      Object.keys(p)[0].includes("plats")
    );
    const shift = rawPermissions.filter((p) =>
      Object.keys(p)[0].includes("shift_supervisor")
    );

    return { plats, shift }; // Return the categorized data
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.get("/api/permisions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawPermissions = response.data.permision;

      // Categorize the data
      const plats = rawPermissions.filter((p) =>
        Object.keys(p)[0].includes("plats")
      );
      const shift = rawPermissions.filter((p) =>
        Object.keys(p)[0].includes("shift_supervisor")
      );

      return { plats, shift };
    }
    console.error("There was an error fetching permissions:", error);
    throw error; // Throw error for handling in the component
  }
};

export const createUser = async (userData) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.post("/api/user", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.post("/api/user", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
    console.error("Error creating user:", error);
    throw error;
  }
};

export const createRole = async (roleData) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.post("/api/userPermisions/", roleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.post("/api/userPermisions/", roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    }
    console.error("Error creating role:", error);
    throw error;
  }
};

export const editUser = async (userData) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.put("/api/user", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.put("/api/user", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
    console.error("Error creating user:", error);
    throw error;
  }
};

export const editRole = async (requestBody, roleName) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.put(
      `/api/userPermisions/${roleName}/`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.put(
        `/api/userPermisions/${roleName}/`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    }
    console.error("Error editing role:", error);
    throw error;
  }
};

export const deleteUser = async (username) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.delete("/api/user", {
      data: { username },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.delete("/api/user", {
        data: { username },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    }
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const deleteRole = async (roleName) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await refreshToken();
    }

    const response = await axios.delete(`/api/userPermisions/${roleName}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      token = await refreshToken();
      const response = await axios.delete(`/api/userPermisions/${roleName}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
    console.error("Error deleting role:", error);
    throw error;
  }
};
