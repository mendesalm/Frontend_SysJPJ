import apiClient from "./apiClient";

// Modificado para aceitar parâmetros
export const getComissoes = (params) => {
  return apiClient.get("/comissoes", { params });
};

export const createComissao = (comissaoData) => {
  return apiClient.post("/comissoes", comissaoData);
};

export const updateComissao = (id, comissaoData) => {
  return apiClient.put(`/comissoes/${id}`, comissaoData);
};

export const deleteComissao = (id) => {
  return apiClient.delete(`/comissoes/${id}`);
};
