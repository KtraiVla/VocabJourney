import axiosUser from "./axiosUser";

const badgeService = {
  getUserBadges: (maNguoiDung) => {
    return axiosUser.get(`/HuyHieu/nguoidung/${maNguoiDung}`);
  },
  getAllBadgesWithStatus: (maNguoiDung) => {
    return axiosUser.get(`/HuyHieu/nguoidung/${maNguoiDung}/all`);
  },
  getAllBadges: () => {
    return axiosUser.get("/HuyHieu");
  },
  createBadge: (badgeData) => {
    return axiosUser.post("/HuyHieu", badgeData);
  },
  updateBadge: (id, badgeData) => {
    return axiosUser.put(`/HuyHieu/${id}`, badgeData);
  },
  deleteBadge: (id) => {
    return axiosUser.delete(`/HuyHieu/${id}`);
  }
};

export default badgeService;
