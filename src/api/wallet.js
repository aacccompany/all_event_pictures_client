import axios from "axios";
import { API_BASE_URL } from "./config";

export const getMyBalance = async (token) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/v1/wallet/my-balance`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const getMyHistory = async (token) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/v1/wallet/my-history`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const requestWithdraw = async (token, amount) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/v1/wallet/withdraw`,
        { amount },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const verifyPayment = async (token, sessionId) => {
    const response = await axios.post(
        `${API_BASE_URL}/api/v1/wallet/verify-payment`,
        { session_id: sessionId },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};
