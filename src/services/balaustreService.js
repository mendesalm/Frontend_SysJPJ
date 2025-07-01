import apiClient from './apiClient';

export const setNextBalaustreNumber = async (nextNumber) => {
  try {
    const response = await apiClient.post('/balaustres/settings/next-number', { nextNumber });
    return response.data;
  } catch (error) {
    throw error;
  }
};