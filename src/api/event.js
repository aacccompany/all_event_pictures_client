import axios from "axios"

export const get_events = async () => {
    return await axios.get("http://localhost:8081/api/v1/events")
}

export const get_event = async (id) => {
    return await axios.get(`http://localhost:8081/api/v1/event/${id}`)
}

export const get_active_events = async() => {
    return await axios.get(`http://localhost:8081/api/v1/active-events`)
}

export const search_events = async(title) => {
    return await axios.get(`http://localhost:8081/api/v1/search-events?title=${title}`)
}

export const create_event = async(token,data) => {
    return await axios.post(`http://localhost:8081/api/v1/event`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const remove_event = async(token, id) => {
    return await axios.get(`http://localhost:8081/api/v1/event/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}