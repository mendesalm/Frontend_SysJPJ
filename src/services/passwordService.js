import apiClient from './apiClient';

export const updatePassword = async (passwordData) => {
  const response = await apiClient.put('/auth/change-password', passwordData);
  return response.data;
};