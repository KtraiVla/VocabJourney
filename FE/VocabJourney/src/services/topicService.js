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
  createTopic: async (topicData) => {
    const response = await axiosUser.post("/Topic", topicData);
    return response.data;
  },
  updateTopic: async (id, topicData) => {
    const response = await axiosUser.put(`/Topic/${id}`, topicData);
    return response.data;
  },
  deleteTopic: async (id) => {
    const response = await axiosUser.delete(`/Topic/${id}`);
    return response.data;
  },
};

export default topicService;