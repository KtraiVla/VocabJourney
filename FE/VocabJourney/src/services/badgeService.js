import axiosUser from "./axiosUser";

const badgeService = {
  getUserBadges: (maNguoiDung) => {
    return axiosUser.get(`/HuyHieu/nguoidung/${maNguoiDung}`);
  }
};

export default badgeService;
