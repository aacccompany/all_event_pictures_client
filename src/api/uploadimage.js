import axios from "axios";
import { API_BASE_URL } from "./config";

export const upload_image_cover = async (token, file) => {
  return await axios.post(`${API_BASE_URL}/api/v1/image`, file, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const upload_images = async(token, id, data) => {
    return await axios.post(`${API_BASE_URL}/api/v1/upload-images/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
