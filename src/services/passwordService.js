import apiClient from './apiClient';

export const updatePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};