import axiosUser from "./axiosUser";

const statsService = {
  getUserStats: async (maNguoiDung) => {
    if (!maNguoiDung) return null;
    // Sửa lại endpoint cho đúng với Route trong ThongKeController.cs
    const response = await axiosUser.get(`/ThongKe/${maNguoiDung}`);
    return response;
  },
};

export default statsService;
