import axios from "axios";
import { API_BASE_URL } from "./config";

export const createTicket = async (token, data) => {
    return await axios.post(`${API_BASE_URL}/api/v1/helpdesk/`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getMyTickets = async (token) => {
    return await axios.get(`${API_BASE_URL}/api/v1/helpdesk/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getAllTickets = async (token) => {
    return await axios.get(`${API_BASE_URL}/api/v1/helpdesk/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateTicketStatus = async (token, id, statusData) => {
    return await axios.patch(`${API_BASE_URL}/api/v1/helpdesk/${id}`, statusData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
