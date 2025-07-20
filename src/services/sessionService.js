import apiClient from "./apiClient";

// Busca todas as sessões, agora com suporte a paginação
export const getSessions = async (params) => {
  const response = await apiClient.get("/sessions", { params });
  console.log("[sessionService] Resposta de getSessions:", response.data);
  return response;
};

// Busca uma sessão específica por ID
export const getSessionById = async (id) => {
  const response = await apiClient.get(`/sessions/${id}`);
  console.log("[sessionService] Raw response for getSessionById:", response.data);
  return response;
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
/**
 * Atualiza o responsável pelo jantar de uma sessão específica.
 * @param {string} sessionId - O ID da sessão.
 * @param {{tipo: string, membroId: number | null}} data - Dados da responsabilidade.
 */
export const updateResponsavelJantar = (sessionId, data) => {
  return apiClient.put(`/sessions/${sessionId}/jantar`, data);
};

/**
 * Atualiza o status de presença dos membros em uma sessão.
 * @param {string} sessionId - O ID da sessão.
 * @param {Array<Object>} attendanceData - Array de objetos com { lodgeMemberId, statusPresenca }.
 */
export const updateSessionAttendance = (sessionId, attendanceData) => {
  return apiClient.put(`/sessions/${sessionId}/attendance`, { attendees: attendanceData });
};
