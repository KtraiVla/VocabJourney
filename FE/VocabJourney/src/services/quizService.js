import axiosUser from "./axiosUser";

const quizService = {
  // Lấy dữ liệu bài Quiz theo mã bài học
  getQuizByLesson: async (maBaiHoc) => {
    try {
      const response = await axiosUser.get(`/Quiz/bai-hoc/${maBaiHoc}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy quiz:", error);
      throw error;
    }
  },
  getAllQuizzes: async () => {
    const response = await axiosUser.get("/Quiz");
    return response.data;
  },
  deleteQuiz: async (id) => {
    const response = await axiosUser.delete(`/Quiz/${id}`);
    return response.data;
  },
};

export default quizService;
