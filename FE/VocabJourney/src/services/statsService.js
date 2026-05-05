import axiosUser from "./axiosUser";

const statsService = {
  getUserStats: async (maNguoiDung) => {
    if (!maNguoiDung) return null;
    // Sửa lại endpoint cho đúng với Route trong ThongKeController.cs
    const response = await axiosUser.get(`/ThongKe/${maNguoiDung}`);
    return response;
  },
  getWeeklyActivity: async (maNguoiDung) => {
    if (!maNguoiDung) return null;
    const response = await axiosUser.get(`/ThongKe/hoatdong/${maNguoiDung}`);
    return response;
  },
  getAccuracyTrend: async (maNguoiDung) => {
    if (!maNguoiDung) return null;
    const response = await axiosUser.get(`/ThongKe/accuracy/${maNguoiDung}`);
    return response;
  },
  getStudyDistribution: async (maNguoiDung) => {
    if (!maNguoiDung) return null;
    const response = await axiosUser.get(`/ThongKe/distribution/${maNguoiDung}`);
    return response;
  },
  getRecentActivities: async (maNguoiDung) => {
    if (!maNguoiDung) return null;
    const response = await axiosUser.get(`/ThongKe/recent/${maNguoiDung}`);
    return response;
  },
};

export default statsService;
