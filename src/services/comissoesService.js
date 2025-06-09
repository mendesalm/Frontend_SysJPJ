import apiClient from './apiClient';

export const getComissoes = () => {
  return apiClient.get('/comissoes');
};

export const createComissao = (comissaoData) => {
  return apiClient.post('/comissoes', comissaoData);
};

export const updateComissao = (id, comissaoData) => {
  return apiClient.put(`/comissoes/${id}`, comissaoData);
};

export const deleteComissao = (id) => {
  return apiClient.delete(`/comissoes/${id}`);
};
