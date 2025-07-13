// src/services/lojaService.js
import apiClient from "./apiClient";

/**
 * Busca lojas para o autocompletar.
 * @param {string} query - O termo a ser buscado.
 * @returns {Promise}
 */
export const searchLojas = (query, searchType = "nome") => {
  return apiClient.get(`/lojas/search`, { params: { q: query, type: searchType } });
};

/**
 * Lista todas as lojas cadastradas.
 * @returns {Promise}
 */
export const getAllLojas = () => {
  return apiClient.get("/lojas");
};

/**
 * Cria uma nova loja.
 * @param {object} lojaData - Dados da nova loja.
 * @returns {Promise}
 */
export const createLoja = (lojaData) => {
  return apiClient.post("/lojas", lojaData);
};

/**
 * Atualiza uma loja existente.
 * @param {number} id - O ID da loja.
 * @param {object} lojaData - Os novos dados da loja.
 * @returns {Promise}
 */
export const updateLoja = (id, lojaData) => {
  return apiClient.put(`/lojas/${id}`, lojaData);
};

/**
 * Apaga o registo de uma loja.
 * @param {number} id - O ID da loja.
 * @returns {Promise}
 */
export const deleteLoja = (id) => {
  return apiClient.delete(`/lojas/${id}`);
};
