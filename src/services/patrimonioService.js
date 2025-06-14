import apiClient from "./apiClient";

// Modificado para aceitar parâmetros
export const getPatrimonios = (params) => {
  return apiClient.get("/patrimonio", { params });
};

export const createPatrimonio = (patrimonioData) => {
  return apiClient.post("/patrimonio", patrimonioData);
};

export const updatePatrimonio = (id, patrimonioData) => {
  return apiClient.put(`/patrimonio/${id}`, patrimonioData);
};

export const deletePatrimonio = (id) => {
  return apiClient.delete(`/patrimonio/${id}`);
};
