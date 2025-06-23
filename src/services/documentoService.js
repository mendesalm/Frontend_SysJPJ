// src/services/documentoService.js
import apiClient from "./apiClient";

// CORREÇÃO: Funções renomeadas para um padrão genérico.
export const getAll = (params) => {
  return apiClient.get("/documentos", { params });
};

export const create = (formData) => {
  return apiClient.post("/documentos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const update = (id, formData) => {
  return apiClient.put(`/documentos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItem = (id) => {
  return apiClient.delete(`/documentos/${id}`);
};
