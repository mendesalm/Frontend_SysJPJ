import apiClient from "./apiClient.js";

export const getEscala = () => {
  return apiClient.get("/escala");
};

export const updateOrdemEscala = (novaOrdemIds) => {
  return apiClient.put("/escala/ordenar", { novaOrdemIds });
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

// --- NOVAS FUNÇÕES ADICIONADAS ---

/**
 * Adiciona um membro específico ao final da fila da escala.
 * @param {number} lodgeMemberId - O ID do membro a ser adicionado.
 */
export const adicionarMembroEscala = (lodgeMemberId) => {
  return apiClient.post("/escala/adicionar", { lodgeMemberId });
};

/**
 * Remove permanentemente um membro da escala.
 * @param {number} escalaId - O ID do registro na tabela ResponsabilidadesJantar.
 */
export const removerMembroEscala = (escalaId) => {
  return apiClient.delete(`/escala/${escalaId}`);
};
