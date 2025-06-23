// src/services/classificadosService.js
import apiClient from "./apiClient";

// Lista todos os classificados
export const getClassificados = (params) => {
  return apiClient.get("/classificados", { params });
};

// Busca um classificado específico por ID
export const getClassificadoById = (id) => {
  return apiClient.get(`/classificados/${id}`);
};

// Cria um novo classificado
export const createClassificado = (formData) => {
  return apiClient.post("/classificados", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Atualiza um classificado existente (apenas campos de texto)
export const updateClassificado = (id, data) => {
  return apiClient.put(`/classificados/${id}`, data);
};

// Deleta um classificado
export const deleteClassificado = (id) => {
  return apiClient.delete(`/classificados/${id}`);
};
