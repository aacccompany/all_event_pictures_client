import axios from "axios";

export const authRegister = async (data) => {
  return await axios.post(`http://localhost:8081/api/v1/register`, data);
};

export const authRegisterUserPublic = async (data) => {
  return await axios.post(`http://localhost:8081/api/v1/register/user_public`, data);
};

export const authLogin = async (data) => {
  return await axios.post(`http://localhost:8081/api/v1/login`,data);
};

export const currentUserPublic = async (token) => {
    return await axios.post(`http://localhost:8081/api/v1/current-user-public`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentUser = async (token) => {
    return await axios.post(`http://localhost:8081/api/v1/current-user`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentAdmin = async (token) => {
    return await axios.post(`http://localhost:8081/api/v1/current-admin`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const currentSuperAdmin = async (token) => {
    return await axios.post(`http://localhost:8081/api/v1/current-superAdmin`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

