import axios from "axios";
import { API_BASE_URL } from "./config";

export const join_event = async(id, token) => {
    return await axios.post(`${API_BASE_URL}/event/${id}/join`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const invite_event = async(token, id, data) => {
    return await axios.post(`${API_BASE_URL}/event/${id}/invite`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const leave_event = async(token,id) => {
    return await axios.delete(`${API_BASE_URL}/event/${id}/leave`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// Get all photographers (users) joined to an event
export const get_event_photographers = async(id, token) => {
    return await axios.get(`${API_BASE_URL}/event/${id}/photographers`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// Add photographer to event
export const add_photographer_to_event = async(id, token, user_id) => {
    return await axios.post(`${API_BASE_URL}/event/${id}/photographers`,
        { user_id },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

// Remove photographer from event
export const remove_photographer_from_event = async(id, token, user_id) => {
    return await axios.delete(`${API_BASE_URL}/event/${id}/photographers/${user_id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
