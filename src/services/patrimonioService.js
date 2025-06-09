import apiClient from './apiClient';

export const getPatrimonios = () => {
  return apiClient.get('/patrimonio');
};

export const createPatrimonio = (patrimonioData) => {
  return apiClient.post('/patrimonio', patrimonioData);
};

export const updatePatrimonio = (id, patrimonioData) => {
  return apiClient.put(`/patrimonio/${id}`, patrimonioData);
};

export const deletePatrimonio = (id) => {
  return apiClient.delete(`/patrimonio/${id}`);
};
