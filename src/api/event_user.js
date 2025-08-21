import axios from "axios";

export const join_event = async(id, token) => {
    return await axios.post(`http://localhost:8081/api/v1/event/${id}/join`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}