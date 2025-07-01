import apiClient from './apiClient';

const API_URL = '/documentos-gerados';

/**
 * Gera um novo documento do tipo Prancha.
 * @param {object} data - Dados da prancha (titulo, conteudo, placeholders).
 * @returns {Promise<object>}
 */
export const generatePrancha = (data) => {
  return apiClient.post(`${API_URL}/prancha`, data);
};

/**
 * Gera um novo documento do tipo Convite.
 * @param {object} data - Dados do convite (titulo, conteudo, placeholders).
 * @returns {Promise<object>}
 */
export const generateConvite = (data) => {
  return apiClient.post(`${API_URL}/convite`, data);
};

/**
 * Gera um novo documento do tipo Cartão.
 * @param {object} data - Dados do cartão (titulo, conteudo, placeholders).
 * @returns {Promise<object>}
 */
export const generateCartao = (data) => {
  return apiClient.post(`${API_URL}/cartao`, data);
};

/**
 * Lista todos os documentos gerados, com filtros opcionais.
 * @param {object} params - Parâmetros de busca (tipo, termo).
 * @returns {Promise<Array<object>>}
 */
export const getGeneratedDocuments = (params) => {
  return apiClient.get(API_URL, { params });
};

/**
 * Obtém os detalhes de um documento específico.
 * @param {number} id - ID do documento.
 * @returns {Promise<object>}
 */
export const getGeneratedDocumentById = (id) => {
  return apiClient.get(`${API_URL}/${id}`);
};
