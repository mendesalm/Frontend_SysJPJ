import apiClient from "./apiClient";

// Busca todas as sessões, agora com suporte a paginação
export const getSessions = (params) => {
  return apiClient.get("/sessions", { params });
};

// Busca uma sessão específica por ID
export const getSessionById = (id) => {
  return apiClient.get(`/sessions/${id}`);
};

// Cria uma nova sessão.
export const createSession = (formData) => {
  return apiClient.post("/sessions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Atualiza uma sessão existente
export const updateSession = (id, formData) => {
  return apiClient.put(`/sessions/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Apaga uma sessão
export const deleteSession = (id) => {
  return apiClient.delete(`/sessions/${id}`);
};

// NOVA FUNÇÃO ADICIONADA
/**
 * Busca os dados para o painel do Chanceler de uma sessão específica.
 * @param {string} sessionId - O ID da sessão.
 * @param {string} dataFim - A data final no formato YYYY-MM-DD.
 */
export const getDadosPainelChanceler = (sessionId, dataFim) => {
  console.log(
    `[sessionService] Buscando dados do painel para a sessão ${sessionId} até ${dataFim}`
  );
  return apiClient.get(`/sessions/${sessionId}/painel-chanceler`, {
    params: { dataFim },
  });
};
