import axiosUser from "./axiosUser.js";

const vocabService = {
  getTuVungByBaiHoc: async (maBaiHoc) => {
    const response = await axiosUser.get(`/TuVung/baihoc/${maBaiHoc}`);
    return response;
  },
  getTuVungByBaiHocWithProgress: async (maBaiHoc, maNguoiDung) => {
    const response = await axiosUser.get(`/TuVung/baihoc/${maBaiHoc}/${maNguoiDung}`);
    return response;
  },
  getAllVocab: async () => {
    const response = await axiosUser.get("/TuVung");
    return response.data;
  },
  createVocab: async (vocabData) => {
    const response = await axiosUser.post("/TuVung", vocabData);
    return response.data;
  },
  updateVocab: async (id, vocabData) => {
    const response = await axiosUser.put(`/TuVung/${id}`, vocabData);
    return response.data;
  },
  deleteVocab: async (id) => {
    const response = await axiosUser.delete(`/TuVung/${id}`);
    return response.data;
  },
};

export default vocabService;
