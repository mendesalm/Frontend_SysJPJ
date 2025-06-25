// src/services/chancelerService.js
import apiClient from "./apiClient";

/**
 * Solicita a geração de um cartão de aniversário para um membro ou familiar.
 * @param {{ memberId?: number, familyMemberId?: number }} data - O ID do membro ou do familiar.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const gerarCartao = (data) => {
  return apiClient.post("/chanceler/gerar-cartao", data);
};
