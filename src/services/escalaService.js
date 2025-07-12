import apiClient from "./apiClient.js";

export const getEscala = () => {
  return apiClient.get("/escala");
};

// CORREÇÃO DEFINITIVA: A função agora envia um objeto com a chave "ordemIds",
// conforme especificado no novo relatório do backend.
export const updateOrdemEscala = (ids) => {
  return apiClient.put("/escala/ordenar", { ordemIds: ids });
};

export const getProximoResponsavel = () => {
  return apiClient.get("/escala/proximo-responsavel");
};

export const updateStatusEscala = (escalaId, status) => {
  return apiClient.put(`/escala/${escalaId}/status`, { status });
};

export const inicializarEscala = (primeiroMembroId = null) => {
  return apiClient.post("/escala/inicializar", { primeiroMembroId });
};

export const adicionarMembroEscala = (lodgeMemberId) => {
  return apiClient.post("/escala/adicionar", { lodgeMemberId });
};

export const removerMembroEscala = (escalaId) => {
  return apiClient.delete(`/escala/${escalaId}`);
};

export const getProximosDaFila = () => {
  return apiClient.get("/escala-jantar/proximos");
};
