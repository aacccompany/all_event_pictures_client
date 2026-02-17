import axios from "axios"
import { API_BASE_URL } from "./config";

export const get_events = async (start_date = null, limit = null) => {
    const params = {};
    if (start_date) {
        params.start_date = start_date.toISOString(); // Convert date to ISO string
    }
    if (limit) {
        params.limit = limit;
    }
    return await axios.get(`${API_BASE_URL}/api/v1/events`, { params });
}

export const get_my_events = async (token, start_date = null, limit = null) => {
    const params = {};
    if (start_date) {
        params.start_date = start_date.toISOString();
    }
    if (limit) {
        params.limit = limit;
    }
    return await axios.get(`${API_BASE_URL}/api/v1/events/my-events`, {
        params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const get_my_created_events = async (token, start_date = null, limit = null) => {
    const params = {};
    if (start_date) {
        params.start_date = start_date.toISOString();
    }
    if (limit) {
        params.limit = limit;
    }
    return await axios.get(`${API_BASE_URL}/api/v1/events/my-created-events`, {
        params,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const get_event = async (id) => {
    return await axios.get(`${API_BASE_URL}/api/v1/event/${id}`)
}

export const get_active_events = async() => {
    return await axios.get(`${API_BASE_URL}/api/v1/active-events`)
}

export const search_events = async(title) => {
    return await axios.get(`${API_BASE_URL}/api/v1/search-events?title=${title}`)
}

export const create_event = async(token,data) => {
    return await axios.post(`${API_BASE_URL}/api/v1/event`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const remove_event = async(token, id) => {
    return await axios.delete(`${API_BASE_URL}/api/v1/event/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const update_event = async(token, id, data) => {
    return await axios.patch(`${API_BASE_URL}/api/v1/event/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const search_faces_in_event = async (event_id, token, search_image) => {
    const formData = new FormData();
    formData.append("search_image", search_image);

    return await axios.post(`${API_BASE_URL}/api/v1/search-faces/${event_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
};
