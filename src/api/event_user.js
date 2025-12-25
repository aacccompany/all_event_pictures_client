import axios from "axios";
import { API_BASE_URL } from "./config";

export const join_event = async(id, token) => {
    return await axios.post(`${API_BASE_URL}/api/v1/event/${id}/join`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const invite_event = async(token, id, data) => {
    return await axios.post(`${API_BASE_URL}/api/v1/event/${id}/invite`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const leave_event = async(token,id) => {
    return await axios.delete(`${API_BASE_URL}/api/v1/event/${id}/leave`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

