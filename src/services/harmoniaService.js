import apiClient from './apiClient';

export const getHarmoniaItens = (params) => {
  return apiClient.get('/harmonia', { params });
};

export const createHarmoniaItem = (formData) => {
  return apiClient.post('/harmonia', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteHarmoniaItem = (id) => {
  return apiClient.delete(`/harmonia/${id}`);
};
