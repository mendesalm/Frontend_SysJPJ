// src/services/visitacaoService.js
import apiClient from "./apiClient";

/**
 * Busca a lista de todas as visitações, com suporte a paginação e filtros.
 * @param {object} params - Parâmetros como { page, limit, search }
 * @returns {Promise}
 */
export const getAllVisitas = (params) => {
  return apiClient.get("/visitas", { params });
};

/**
 * Busca a lista de visitações apenas do membro logado.
 * @param {object} params - Parâmetros como { page, limit }
 * @returns {Promise}
 */
export const getMyVisitas = (params) => {
  return apiClient.get("/visitas/me", { params });
};

/**
 * Cria um novo registro de visitação.
 * @param {object} visitaData - Os dados da nova visita.
 * @returns {Promise}
 */
export const createVisita = (visitaData) => {
  return apiClient.post("/visitas", visitaData);
};

/**
 * Atualiza um registro de visitação existente.
 * @param {number} id - O ID da visita a ser atualizada.
 * @param {object} visitaData - Os novos dados da visita.
 * @returns {Promise}
 */
export const updateVisita = (id, visitaData) => {
  return apiClient.put(`/visitas/${id}`, visitaData);
};

/**
 * Apaga um registro de visitação.
 * @param {number} id - O ID da visita a ser apagada.
 * @returns {Promise}
 */
export const deleteVisita = (id) => {
  return apiClient.delete(`/visitas/${id}`);
};
