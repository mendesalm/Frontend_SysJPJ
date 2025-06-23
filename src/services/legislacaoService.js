// src/services/legislacaoService.js
import apiClient from "./apiClient";

// CORREÇÃO: Funções renomeadas para um padrão genérico.
export const getAll = (params) => {
  return apiClient.get("/legislacoes", { params });
};

export const create = (formData) => {
  return apiClient.post("/legislacoes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const update = (id, formData) => {
  return apiClient.put(`/legislacoes/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItem = (id) => {
  return apiClient.delete(`/legislacoes/${id}`);
};
