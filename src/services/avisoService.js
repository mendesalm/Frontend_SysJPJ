import apiClient from "./apiClient";

// Modificado para aceitar parâmetros
export const getAllAvisos = (params) => {
  return apiClient.get("/avisos", { params });
};

// Cria um novo aviso
export const createAviso = (avisoData) => {
  return apiClient.post("/avisos", avisoData);
};

// Atualiza um aviso existente
export const updateAviso = (id, avisoData) => {
  return apiClient.put(`/avisos/${id}`, avisoData);
};

// Apaga um aviso
export const deleteAviso = (id) => {
  return apiClient.delete(`/avisos/${id}`);
};
