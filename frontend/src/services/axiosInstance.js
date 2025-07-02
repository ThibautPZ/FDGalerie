import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  // validateStatus: (status) => {
  //   return status < 400;
  // },
});

export default axiosInstance;
