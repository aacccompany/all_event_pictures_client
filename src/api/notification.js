import axios from "axios";
import { API_BASE_URL } from "./config";

export const getMyNotifications = async (token) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/v1/notifications`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const getUnreadCount = async (token) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/v1/notifications/unread-count`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const markAsRead = async (token, id) => {
    const response = await axios.patch(
        `${API_BASE_URL}/api/v1/notifications/${id}/read`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};
