// src/services/locacaoService.js
import apiClient from "./apiClient";

/**
 * Busca as datas ocupadas para um determinado mês e ano para preencher o calendário.
 * @param {number} ano - O ano a ser consultado.
 * @param {number} mes - O mês a ser consultado (1-12).
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCalendarioOcupacao = (ano, mes) => {
  return apiClient.get("/locacoes/calendario", { params: { ano, mes } });
};

/**
 * Lista todas as solicitações de locação (requer permissão de gestão).
 * @param {object} params - Parâmetros de paginação ou filtro.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getLocacoes = (params) => {
  return apiClient.get("/locacoes", { params });
};

/**
 * Cria uma nova solicitação de locação.
 * @param {object} locacaoData - Os dados da nova locação.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createLocacao = (locacaoData) => {
  return apiClient.post("/locacoes", locacaoData);
};

/**
 * Confirma uma solicitação de locação pendente.
 * @param {number} id - O ID da locação a ser confirmada.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const confirmarLocacao = (id) => {
  return apiClient.put(`/locacoes/${id}/confirmar`);
};

/**
 * Cancela uma solicitação de locação.
 * @param {number} id - O ID da locação a ser cancelada.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const cancelarLocacao = (id) => {
  return apiClient.put(`/locacoes/${id}/cancelar`);
};

/**
 * NOVO: Encerra uma locação que já foi confirmada.
 * @param {number} id - O ID da locação a ser encerrada.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const encerrarLocacao = (id) => {
  return apiClient.put(`/locacoes/${id}/encerrar`);
};
