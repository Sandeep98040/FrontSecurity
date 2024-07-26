import axios from "axios";

const baseUrl = "https://localhost:4000/users";
const getToken = () => `bearer ${window.localStorage.getItem("token")}`;

const register = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error", error);
    throw error;
  }
};

const login = async (loginCredentials) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, loginCredentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const lockAccount = async (email) => {
  try {
    const response = await axios.post(`${baseUrl}/lockAccount`, { email });
    return response.data;
  } catch (error) {
    console.error("Lock account error", error);
    throw error;
  }
};

const passwordNeedChange = async () => {
  try {
    const response = await axios.get(`${baseUrl}/passwordNeedChange`, {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error("Password need change error", error);
    throw error;
  }
};

const getUser = async () => {
  try {
    const response = await axios.get(baseUrl, {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error("Get user error", error);
    throw error;
  }
};

const deleteAccount = async () => {
  try {
    const response = await axios.delete(baseUrl, {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error("Delete account error", error);
    throw error;
  }
};

const changeName = async (newName) => {
  try {
    const response = await axios.put(
      baseUrl,
      { newName },
      {
        headers: { Authorization: getToken() },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Change name error", error);
    throw error;
  }
};

const changePassword = async (newPassword) => {
  try {
    const response = await axios.put(
      `${baseUrl}/changePassword`,
      { newPassword },
      {
        headers: { Authorization: getToken() },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Change password error", error);
    throw error;
  }
};

const uploadProfileImage = async (selectedImageFile) => {
  const formData = new FormData();
  formData.append("photo", selectedImageFile);

  const config = {
    headers: {
      Authorization: getToken(),
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await axios.post(
      "https://localhost:4000/uploads",
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Upload profile image error", error);
    throw error;
  }
};

const uploadProductImage = async (productId, selectedImageFile) => {
  const formData = new FormData();
  formData.append("photo", selectedImageFile);

  const config = {
    headers: {
      Authorization: getToken(),
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await axios.post(
      `https://localhost:4000/uploads/${productId}`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Upload product image error", error);
    throw error;
  }
};

const getAllPurchaseProducts = async () => {
  try {
    const response = await axios.get("https://localhost:4000/purchase", {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    console.error("Get all purchase products error", error);
    throw error;
  }
};

const unlockAccount = async (userId) => {
  try {
    const response = await axios.post(
      `https://localhost:4000/admin/unlockAccount/${userId}`,
      {},
      {
        headers: { Authorization: getToken() },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Unlock account error", error);
    throw error;
  }
};

const userServices = {
  login,
  lockAccount,
  passwordNeedChange,
  getUser,
  register,
  deleteAccount,
  changeName,
  changePassword,
  uploadProductImage,
  uploadProfileImage,
  getAllPurchaseProducts,
  unlockAccount,
};

export default userServices;
