import apiClient from "./apiClient.js";

// Busca os detalhes de um balaústre específico pelo seu ID do BD
export const getBalaustre = (id) => {
  return apiClient.get(`/balaustres/${id}`);
};

// Atualiza um balaústre existente com novos dados
export const updateBalaustre = (id, data) => {
  return apiClient.put(`/balaustres/${id}`, data);
};
