import axios from "axios";
import { API_BASE_URL } from "./config";

export const get_my_events = async(token) => {
    return await axios.get(`${API_BASE_URL}/my-events` , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const get_events_joined = async(token) => {
    return await axios.get(`${API_BASE_URL}/events-joined`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const get_profile = async(token) => {
    return await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const update_profile = async(token, data) => {
    return await axios.put(`${API_BASE_URL}/profile`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const update_book_bank_image = async(token, formData) => {
    return await axios.patch(`${API_BASE_URL}/profile/book-bank-image`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const get_bank_info = async(token) => {
    return await axios.get(`${API_BASE_URL}/bank-info`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const update_bank_info = async(token, data) => {
    return await axios.put(`${API_BASE_URL}/bank-info`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
