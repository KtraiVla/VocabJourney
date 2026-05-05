import axiosUser from "./axiosUser";

const topicService = {
  getAllTopics: async (maNguoiDung = null) => {
    const url = maNguoiDung ? `/Topic?maNguoiDung=${maNguoiDung}` : "/Topic";
    const response = await axiosUser.get(url);
    return response;
  },
  getTopicById: async (id, maNguoiDung = null) => {
    const url = maNguoiDung ? `/Topic/${id}?maNguoiDung=${maNguoiDung}` : `/Topic/${id}`;
    const response = await axiosUser.get(url);
    return response;
  },
};

export default topicService;