import axios from "axios";

export const get_my_events = async(token) => {
    return await axios.get("http://localhost:8081/api/v1/my-events" , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const get_events_joined = async(token) => {
    return await axios.get("http://localhost:8081/api/v1/events-joined", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}