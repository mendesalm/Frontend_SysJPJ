import apiClient from './apiClient';

export const updatePassword = async (passwordData) => {
  const response = await apiClient.put('/auth/change-password', passwordData);
  return response.data;
};

export const adminResetUserPassword = async (memberId, passwordData) => {
  const response = await apiClient.put(`/admin/members/${memberId}/reset-password`, passwordData);
  return response.data;
};