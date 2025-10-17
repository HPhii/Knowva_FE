import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const api = axios.create({
  baseURL: SERVER_URL,
});

// 1 hanh dong j do trc khi call api
const handleBefore = (config) => {
  const token = localStorage.getItem("token");
  // Chỉ gửi Authorization header nếu có token và không phải register/login
  if (
    token &&
    !config.url.includes("/register") &&
    !config.url.includes("/login") &&
    !config.url.includes("/send-reset-otp") &&
    !config.url.includes("/reset-password")
  ) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

const handleError = (error) => {
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
