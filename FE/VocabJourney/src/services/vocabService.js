import axiosUser from "./axiosUser.js";

const vocabService = {
  getTuVungByBaiHoc: async (maBaiHoc) => {
    const response = await axiosUser.get(`/TuVung/baihoc/${maBaiHoc}`);
    return response;
  },
};

export default vocabService;
