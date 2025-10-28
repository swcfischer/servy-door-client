import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://servy-door-server.onrender.com"
    : "http://localhost:8888";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
