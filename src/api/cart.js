import axios from "axios";

export const add_cart = async(token, data) => {
    return await axios.post(`http://localhost:8081/api/v1/cart`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}