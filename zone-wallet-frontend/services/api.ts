import axios from "axios";
import { useAuth } from "@clerk/nextjs"; 

const api = axios.create({
  baseURL: "http://localhost:5280",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const GetToken = () => {
  const { getToken } = useAuth();
  try {
    return getToken();
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

api.interceptors.request.use(async (config) => {
  const token = await GetToken();
  if (token) {
    // Set the Authorization header directly
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
export default api;
