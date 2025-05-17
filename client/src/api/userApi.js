import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  return axiosInstance.post('/users/register', userData);
};

export const loginUser = async (userData) => {
  return axiosInstance.post('/users/login', userData);
};

export const getUser = async (userId) => {
  return axiosInstance.get(`/users/${userId}`);
};

export const updateNickname = async (userId, nickname) => {
  return axiosInstance.put(`/users/${userId}/nickname`, { nickname });
};

export default {
  registerUser,
  loginUser,
  getUser,
  updateNickname,
};
