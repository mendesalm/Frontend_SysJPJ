// src/services/templateService.js
import apiClient from "./apiClient";

/**
 * Busca a lista de todos os templates de mensagem existentes.
 * @returns {Promise}
 */
export const getAllTemplates = () => {
  return apiClient.get("/templates");
};

/**
 * Busca o mapa de placeholders disponíveis para cada tipo de gatilho.
 * @returns {Promise}
 */
export const getAvailablePlaceholders = () => {
  return apiClient.get("/templates/placeholders");
};

/**
 * Atualiza um template específico.
 * @param {number} id - O ID do template a ser atualizado.
 * @param {object} templateData - O objeto com os campos { assunto, corpo }.
 * @returns {Promise}
 */
export const updateTemplate = (id, templateData) => {
  return apiClient.put(`/templates/${id}`, templateData);
};
