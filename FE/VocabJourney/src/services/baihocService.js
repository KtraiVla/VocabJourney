import axiosUser from "./axiosUser.js";

const baihocService = {
  getLessonsByTopic: async (maChuDe) => {
    const response = await axiosUser.get(`/BaiHoc/chude/${maChuDe}`);
    return response;
  },
};

export default baihocService;
