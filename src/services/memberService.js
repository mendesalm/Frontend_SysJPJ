// src/services/memberService.js
import apiClient from "./apiClient";

/**
 * Busca todos os membros com suporte a filtros e paginação.
 * A função agora retorna diretamente o array 'data' de dentro da resposta.
 * @param {object} params - Parâmetros como { include, limit, status }
 * @returns {Promise<Array<object>>} Uma promessa que resolve para o array de membros.
 */
export const getAllMembers = async (params) => {
  const response = await apiClient.get("/lodgemembers", { params });
  // SOLUÇÃO: Garante que o frontend sempre receba o array de membros,
  // independentemente da estrutura da resposta.
  return response.data.data || response.data;
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
