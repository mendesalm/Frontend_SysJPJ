import apiClient from './apiClient';

export const getBalaustre = async (id) => {
  const response = await apiClient.get(`/balaustres/${id}`);
  return response.data;
};

export const updateBalaustre = async (id, data) => {
  const response = await apiClient.put(`/balaustres/${id}`, data);
  return response.data;
};

export const setNextBalaustreNumber = async (nextNumber) => {
  const response = await apiClient.post('/balaustres/settings/next-number', { nextNumber });
  return response.data;
};