import axiosUser from "./axiosUser";

const badgeService = {
  getUserBadges: async (maNguoiDung) => {
    const response = await axiosUser.get(`/HuyHieu/nguoidung/${maNguoiDung}`);
    return response;
  },
};

export default badgeService;
