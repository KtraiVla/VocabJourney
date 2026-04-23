import axios from "axios";

// Tạo một bản sao của axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: "https://localhost:7251/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
