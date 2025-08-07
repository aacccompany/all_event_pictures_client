import axios from "axios";

export const authRegister = async (data) => {
  return await axios.post(`http://localhost:8081/api/v1/register`, data);
};

export const authLogin = async (data) => {
  return await axios.post(`http://localhost:8081/api/v1/login`,data);
};
