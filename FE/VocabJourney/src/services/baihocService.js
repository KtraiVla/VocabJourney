import axiosUser from "./axiosUser.js";

const baihocService = {
  getLessonsByTopic: async (maChuDe, maNguoiDung = null) => {
    const url = maNguoiDung 
      ? `/BaiHoc/chude/${maChuDe}?maNguoiDung=${maNguoiDung}`
      : `/BaiHoc/chude/${maChuDe}`;
    const response = await axiosUser.get(url);
    return response;
  },
  getLessonById: async (id) => {
    const response = await axiosUser.get(`/BaiHoc/${id}`);
    return response;
  },
  getAllLessons: async () => {
    const response = await axiosUser.get("/BaiHoc");
    return response.data;
  },
  createLesson: async (lessonData) => {
    const response = await axiosUser.post("/BaiHoc", lessonData);
    return response.data;
  },
  updateLesson: async (id, lessonData) => {
    const response = await axiosUser.put(`/BaiHoc/${id}`, lessonData);
    return response.data;
  },
  deleteLesson: async (id) => {
    const response = await axiosUser.delete(`/BaiHoc/${id}`);
    return response.data;
  },
};

export default baihocService;
