// src/services/chancelerService.js
import apiClient from "./apiClient";

/**
 * Solicita a geração de um cartão de aniversário para um membro ou familiar.
 * O backend irá retornar uma resposta JSON com o caminho para o ficheiro.
 * @param {{ memberId?: number, familyMemberId?: number }} data - O ID do membro ou do familiar.
 * @returns {Promise<axios.AxiosResponse<{caminho: string, message: string}>>} A promessa com a resposta da API.
 */
export const gerarCartao = (data) => {
  return apiClient.post("/chanceler/gerar-cartao", data);
};

/**
 * Busca os dados para o painel do Chanceler.
 * @param {string} dataInicio - A data de início no formato AAAA-MM-DD.
 * @param {string} dataFim - A data de fim no formato AAAA-MM-DD.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getPainelChanceler = (dataInicio, dataFim) => {
  return apiClient.get("/chanceler/panel", {
    params: { dataInicio, dataFim },
  });
};
