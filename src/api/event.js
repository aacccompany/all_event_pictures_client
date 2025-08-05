import axios from "axios"

export const get_events = async () => {
    return await axios.get("http://localhost:8081/api/v1/events")
}

export const get_event = async (id) => {
    return await axios.get(`http://localhost:8081/api/v1/event/${id}`)
}