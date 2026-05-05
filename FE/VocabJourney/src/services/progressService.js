import axiosUser from "./axiosUser";

const progressService = {
  // Lưu tiến độ khi hoàn thành 1 bài học
  saveLessonProgress: async (maNguoiDung, maBaiHoc) => {
    const response = await axiosUser.post("/TienDo/luu-bai-hoc", {
      maNguoiDung,
      maBaiHoc,
    });
    return response;
  },

  getRecentLesson: async (maNguoiDung) => {
    const response = await axiosUser.get(`/TienDo/bai-hoc-gan-nhat/${maNguoiDung}`);
    return response;
  },

  getReviewCount: async (maNguoiDung) => {
    const response = await axiosUser.get(`/TienDo/so-tu-on-tap/${maNguoiDung}`);
    return response;
  },

  // Lưu tiến độ cho từng từ vựng (nếu cần dùng sau này cho Leitner)
  saveVocabProgress: async (maNguoiDung, maTuVung, daHoc) => {
    const response = await axiosUser.post("/TienDo/luu-tu-vung", {
      maNguoiDung,
      maTuVung,
      daHoc,
    });
    return response.data;
  },
};

export default progressService;
