import axiosClient from "./axiosClient";

const authService = {

  login: (email, matkhau) => {

    return axiosClient.post("/Auth/login", { 
      username: email, 
      password: matkhau 
    });
  },

  // Hàm gọi API Đăng ký
  register: (hoten, email, matkhau) => {
    return axiosClient.post("/Auth/register", { 
      username: hoten, 
      email: email, 
      password: matkhau 
    });
  }
};

export default authService;