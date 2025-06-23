import apiClient from "./apiClient";

/**
 * Busca por visitantes recorrentes na base de dados histórica.
 * Rota: GET /api/visitantes/search
 * @param {string} termoBusca - O nome ou CIM do visitante.
 */
export const searchVisitantes = (termoBusca) => {
  return apiClient.get("/visitantes/search", {
    params: { q: termoBusca },
  });
};

/**
 * Lista todos os visitantes registrados para uma sessão específica.
 * Rota: GET /api/sessions/:sessionId/visitors
 * @param {string} sessionId - O ID da sessão.
 */
export const getVisitantesDaSessao = (sessionId) => {
  return apiClient.get(`/sessions/${sessionId}/visitors`);
};

/**
 * Adiciona um novo visitante a uma sessão específica.
 * Rota: POST /api/sessions/:sessionId/visitors
 * @param {string} sessionId - O ID da sessão.
 * @param {object} visitorData - Dados do visitante (nomeCompleto, cim, etc.).
 */
export const addVisitanteNaSessao = (sessionId, visitorData) => {
  return apiClient.post(`/sessions/${sessionId}/visitors`, visitorData);
};

/**
 * Remove o registro de presença de um visitante de uma sessão.
 * A rota do backend pode variar, mas assumindo a mais provável.
 * Rota: DELETE /api/sessions/:sessionId/visitors/:visitorId
 * @param {string} sessionId - O ID da sessão.
 * @param {string} visitorId - O ID do registro do visitante na sessão.
 */
export const deleteVisitanteDaSessao = (sessionId, visitorId) => {
  return apiClient.delete(`/sessions/${sessionId}/visitors/${visitorId}`);
};
