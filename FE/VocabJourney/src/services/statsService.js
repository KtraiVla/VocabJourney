import axiosUser from "./axiosUser";

const statsService = {
  getUserStats: async (maNguoiDung) => {
    if (!maNguoiDung) return null;
    const response = await axiosUser.get(`/ThongKe/nguoidung/${maNguoiDung}`);
    return response;
  },
};

export default statsService;
