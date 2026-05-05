import axiosUser from "./axiosUser";

const challengeService = {
  getDailyChallenges: async (maNguoiDung) => {
    const response = await axiosUser.get(`/ThuThach/ngay/${maNguoiDung}`);
    return response;
  },
};

export default challengeService;
