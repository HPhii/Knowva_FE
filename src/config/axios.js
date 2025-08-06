import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const api = axios.create({
  baseURL: SERVER_URL,
});

// 1 hanh dong j do trc khi call api
const handleBefore = (config) => {
  const token = localStorage.getItem("token");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

const handleError = (error) => {
  console.log(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
