import axiosUser from "./axiosUser.js";

const baihocService = {
  getLessonsByTopic: async (maChuDe, maNguoiDung = null) => {
    const url = maNguoiDung 
      ? `/BaiHoc/chude/${maChuDe}?maNguoiDung=${maNguoiDung}`
      : `/BaiHoc/chude/${maChuDe}`;
    const response = await axiosUser.get(url);
    return response;
  },
};

export default baihocService;
