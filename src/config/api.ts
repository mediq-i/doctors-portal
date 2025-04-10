import axios from "axios";

export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_STAGING_BASE_API_URL as string,
});
