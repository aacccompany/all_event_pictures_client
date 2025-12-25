import axios from "axios";
import { API_BASE_URL } from "./config";

export const get_my_events = async(token) => {
    return await axios.get(`${API_BASE_URL}/api/v1/my-events` , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const get_events_joined = async(token) => {
    return await axios.get(`${API_BASE_URL}/api/v1/events-joined`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}