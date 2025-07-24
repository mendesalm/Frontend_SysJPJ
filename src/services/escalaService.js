import apiClient from "./apiClient.js";

export const getEscala = () => {
  return apiClient.get("/escala");
};

export const updateOrdemEscala = (ordemIds) => {
  console.log("[escalaService] Enviando para a API:", { ids: ordemIds }); // Log
  return apiClient.put("/responsabilidades-jantar/reorder", { orderedIds: ordemIds });
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

export const swapEscalaOrder = (id1, id2) => {
  return apiClient.put("/responsabilidades-jantar/swap-order", { id1, id2 });
};
