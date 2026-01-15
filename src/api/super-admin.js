import axios from "axios";

// List Users
export const getUsers = async (token, page = 1, size = 10, include_deleted = false) => {
  return await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v1/super-admin/users?page=${page}&size=${size}&include_deleted=${include_deleted}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Get User Details
export const getUser = async (token, id) => {
  return await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v1/super-admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Create User
export const createUser = async (token, userData) => {
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/api/v1/super-admin/users`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Update User
export const updateUser = async (token, id, userData) => {
  return await axios.put(
    `${import.meta.env.VITE_API_URL}/api/v1/super-admin/users/${id}`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Delete User (Soft Delete)
export const deleteUser = async (token, id) => {
  return await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/v1/super-admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
