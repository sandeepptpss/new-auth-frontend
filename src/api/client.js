// src/api/client.js
import axios from "axios";

export const API_ORIGIN =
  process.env.REACT_APP_API_URL || "http://localhost:8002";

export const API_BASE = `${API_ORIGIN}/api`;

/**
 * Build an absolute URL for a file served out of the backend `uploads` folder.
 * The API stores paths like "uploads/images/foo.png" (no leading slash).
 */
export const assetUrl = (path) => {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  return `${API_ORIGIN}/${String(path).replace(/^\/+/, "")}`;
};

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

/** Pull a human-readable message out of an axios error. */
export const errorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

export default api;
