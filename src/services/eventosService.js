import apiClient from "./apiClient";

// Modificado para aceitar parâmetros
export const getEventos = (params) => {
  return apiClient.get("/eventos", { params });
};

export const getEventoById = (id) => {
  return apiClient.get(`/eventos/${id}`);
};

export const createEvento = (eventoData) => {
  return apiClient.post("/eventos", eventoData);
};

export const updateEvento = (id, eventoData) => {
  return apiClient.put(`/eventos/${id}`, eventoData);
};

export const deleteEvento = (id) => {
  return apiClient.delete(`/eventos/${id}`);
};

// Função para confirmar ou recusar presença num evento
export const confirmarPresenca = (eventoId, status) => {
  // A rota do backend espera um POST em /api/eventos/:eventoId/presenca
  return apiClient.post(`/eventos/${eventoId}/presenca`, status);
};
