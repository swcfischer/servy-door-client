import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8888";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export default axiosInstance;
