import apiClient from "./apiClient";

/**
 * Busca a lista de todas as mensagens, com suporte a filtros.
 * @param {object} params - Parâmetros como { tipo, subtipo }
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getMensagens = (params = {}) => {
  // CORREÇÃO: Cria um novo objeto para conter apenas os filtros com valores.
  const validParams = {};
  if (params.tipo) {
    validParams.tipo = params.tipo;
  }
  if (params.subtipo) {
    validParams.subtipo = params.subtipo;
  }

  // Passa apenas os parâmetros válidos para a chamada da API.
  return apiClient.get("/mensagens", { params: validParams });
};

/**
 * Cria uma nova mensagem.
 * @param {object} mensagemData - Dados da nova mensagem ({ tipo, subtipo, conteudo }).
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createMensagem = (mensagemData) => {
  return apiClient.post("/mensagens", mensagemData);
};

/**
 * Atualiza uma mensagem existente.
 * @param {number} id - O ID da mensagem a ser atualizada.
 * @param {object} mensagemData - Os novos dados da mensagem.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateMensagem = (id, mensagemData) => {
  return apiClient.put(`/mensagens/${id}`, mensagemData);
};

/**
 * Apaga uma mensagem.
 * @param {number} id - O ID da mensagem a ser apagada.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteMensagem = (id) => {
  return apiClient.delete(`/mensagens/${id}`);
};
