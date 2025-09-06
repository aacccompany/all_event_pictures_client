import axios from "axios";

export const add_cart = async(token, data) => {
    return await axios.post(`http://localhost:8081/api/v1/cart`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const get_my_cart = async(token) => {
    return await axios.get(`http://localhost:8081/api/v1/my-cart`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const remove_image_from_cart = async(token, cart_image_id) => {
    return await axios.delete(`http://localhost:8081/api/v1/cart-images/${cart_image_id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const download_my_cart = async(token) => {
    return await axios.get(`http://localhost:8081/api/v1/my-cart/download`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: "blob",
    })
}