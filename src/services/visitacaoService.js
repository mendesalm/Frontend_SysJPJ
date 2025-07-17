// src/services/visitacaoService.js
import apiClient from "./apiClient";

/**
 * Busca a lista de todas as visitações, com suporte a paginação e filtros.
 * @param {object} params - Parâmetros como { page, limit, search }
 * @returns {Promise}
 */
export const getVisitas = (params) => {
  return apiClient.get("/visitas", { params });
};

/**
 * Busca uma visitação específica pelo seu ID.
 * @param {number} id - O ID da visitação.
 * @returns {Promise}
 */
export const getVisitaById = (id) => {
  return apiClient.get(`/visitas/${id}`);
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

/**
 * NOVA FUNÇÃO: Busca lojas para o autocompletar.
 * @param {string} query - O termo a ser buscado.
 * @returns {Promise}
 */
export const searchLojas = (query) => {
  return apiClient.get(`/visitas/lojas/search`, { params: { q: query } });
};
