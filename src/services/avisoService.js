import apiClient from './apiClient';

// Busca todos os avisos ativos
export const getAllAvisos = () => {
  return apiClient.get('/avisos');
};

// Cria um novo aviso
export const createAviso = (avisoData) => {
  return apiClient.post('/avisos', avisoData);
};

// Atualiza um aviso existente
export const updateAviso = (id, avisoData) => {
  return apiClient.put(`/avisos/${id}`, avisoData);
};

// Apaga um aviso
export const deleteAviso = (id) => {
  return apiClient.delete(`/avisos/${id}`);
};