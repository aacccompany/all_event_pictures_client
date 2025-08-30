import axios from "axios";

export const upload_image_cover = async (token, file) => {
  return await axios.post(`http://localhost:8081/api/v1/image`, file, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const upload_images = async(token, id, data) => {
    return await axios.post(`http://localhost:8081/api/v1/upload-images/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
