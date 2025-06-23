// src/services/arquivoService.js
import apiClient from "./apiClient";

// CORREÇÃO: Funções renomeadas para um padrão genérico.
export const getAll = (params) => {
  return apiClient.get("/arquivos-diversos", { params });
};

export const create = (formData) => {
  return apiClient.post("/arquivos-diversos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const update = (id, formData) => {
  return apiClient.put(`/arquivos-diversos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItem = (id) => {
  return apiClient.delete(`/arquivos-diversos/${id}`);
};
