import apiClient from "./apiClient";

// Lista todas as comissões
export const getComissoes = (params) => {
  return apiClient.get("/comissoes", { params });
};

// Obtém os detalhes de uma comissão específica
export const getComissaoById = (id) => {
  return apiClient.get(`/comissoes/${id}`);
};

// Cria uma nova comissão
export const createComissao = (comissaoData) => {
  return apiClient.post("/comissoes", comissaoData);
};

// Atualiza uma comissão existente
export const updateComissao = (id, comissaoData) => {
  return apiClient.put(`/comissoes/${id}`, comissaoData);
};

// Deleta uma comissão
export const deleteComissao = (id) => {
  return apiClient.delete(`/comissoes/${id}`);
};
