import axios from "axios";
import { API_ENDPOINTS } from "./config";

export const get_manage_images = async (token, eventId) => {
  return await axios.get(`${API_ENDPOINTS.v1}/manage/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delete_manage_images = async (token, imageIds) => {
  return await axios.delete(`${API_ENDPOINTS.v1}/manage`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      image_ids: imageIds,
    },
  });
};

export const get_all_managed_images = async (token) => {
  return await axios.get(`${API_ENDPOINTS.v1}/manage/all/global`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

