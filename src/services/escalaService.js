import apiClient from "./apiClient.js";

// Busca a lista completa e ordenada da escala de jantares
export const getEscala = () => {
  return apiClient.get("/escala");
};

// Envia a nova ordem da escala para ser salva no banco
export const updateOrdemEscala = (novaOrdemIds) => {
  return apiClient.put("/escala/ordenar", { novaOrdemIds });
};

// Busca o nome do próximo responsável e seu cônjuge
export const getProximoResponsavel = () => {
  return apiClient.get("/escala/proximo-responsavel");
};
