// src/services/memberService.js
import apiClient from "./apiClient";

/**
 * Busca todos os membros com suporte a filtros e paginação.
 * A função agora retorna diretamente o array 'data' de dentro da resposta.
 * @param {object} params - Parâmetros como { include, limit, status }
 * @returns {Promise<Array<object>>} Uma promessa que resolve para o array de membros.
 */
export const getAllMembers = (params) => {
  return apiClient.get("/lodgemembers", { params });
};

/**
 * Busca os detalhes de um membro específico.
 * @param {number} id - O ID do membro.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getMemberById = (id) => {
  return apiClient.get(`/lodgemembers/${id}`);
};

/**
 * Cria um novo membro.
 * @param {FormData} memberData - Os dados do novo membro.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createMember = (memberData) => {
  return apiClient.post("/lodgemembers", memberData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Atualiza um membro existente.
 * @param {number} id - O ID do membro.
 * @param {FormData} memberData - Os novos dados do membro.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateMember = (id, memberData) => {
  return apiClient.put(`/lodgemembers/${id}`, memberData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Apaga um membro.
 * @param {number} id - O ID do membro.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteMember = (id) => {
  return apiClient.delete(`/lodgemembers/${id}`);
};

export const getMemberCargos = (memberId) => {
  return apiClient.get(`/lodgemembers/${memberId}/cargos`);
};

export const addCargoMembro = (memberId, cargoData) => {
  return apiClient.post(`/lodgemembers/${memberId}/cargos`, cargoData);
};

export const updateCargoMembro = (memberId, cargoId, cargoData) => {
  return apiClient.put(`/lodgemembers/${memberId}/cargos/${cargoId}`, cargoData);
};

export const deleteCargoMembro = (memberId, cargoId) => {
  return apiClient.delete(`/lodgemembers/${memberId}/cargos/${cargoId}`);
};
