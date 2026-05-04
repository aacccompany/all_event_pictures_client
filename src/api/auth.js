import axios from "axios";
import { API_BASE_URL } from "./config";

export const authRegister = async (data) => {
  return await axios.post(`${API_BASE_URL}/register`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // 30 second timeout
  });
};

export const authRegisterUserPublic = async (data) => {
  return await axios.post(`${API_BASE_URL}/register/user_public`, data);
};

export const authLogin = async (data) => {
  return await axios.post(`${API_BASE_URL}/login`,data);
};

export const currentUserPublic = async (token) => {
    return await axios.post(`${API_BASE_URL}/current-user-public`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentUser = async (token) => {
    return await axios.post(`${API_BASE_URL}/current-user`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentAdmin = async (token) => {
    return await axios.post(`${API_BASE_URL}/current-admin`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentSuperAdmin = async (token) => {
    return await axios.post(`${API_BASE_URL}/current-superAdmin`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

