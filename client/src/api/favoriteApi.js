import axiosInstance from './axiosInstance';

// 收藏笔记
export const favoriteNote = async (noteId, userId) => {
  return axiosInstance.post(`/notes/${noteId}/favorite`, { userId });
};

// 取消收藏笔记
export const unfavoriteNote = async (noteId, userId) => {
  return axiosInstance.delete(`/notes/${noteId}/favorite`, {
    data: { userId },
  });
};

// 获取用户收藏的笔记列表
export const getFavoriteNotes = async (userId) => {
  return axiosInstance.get(`/notes/favorites/${userId}`);
};

export default {
  favoriteNote,
  unfavoriteNote,
  getFavoriteNotes,
};
