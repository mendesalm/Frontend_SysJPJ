import apiClient from './apiClient';

export const getEventos = (params) => {
  // params pode ser { dataInicio, dataFim }
  return apiClient.get('/eventos', { params });
};

export const createEvento = (eventoData) => {
  return apiClient.post('/eventos', eventoData);
};

export const confirmarPresenca = (eventoId, status) => {
  // status = { statusConfirmacao: 'Confirmado' | 'Recusado' }
  return apiClient.post(`/eventos/${eventoId}/presenca`, status);
};

export const deleteEvento = (id) => {
  return apiClient.delete(`/eventos/${id}`);
};
