import apiClient from "./apiClient";

// =============================================================================
// == Funções para Tipos de Sessão ==
// =============================================================================

/**
 * Busca todos os Tipos de Sessão.
 * GET /api/harmonia/tipos-sessao
 * CORREÇÃO: Retorna a promessa completa do Axios.
 */
export const getTiposSessao = () => {
  return apiClient.get("/harmonia/tipos-sessao");
};

/**
 * Cria um novo Tipo de Sessão.
 * POST /api/harmonia/tipos-sessao
 * @param {{ nome: string }} tipoSessaoData - Os dados do novo tipo de sessão.
 */
export const createTipoSessao = (tipoSessaoData) => {
  return apiClient.post("/harmonia/tipos-sessao", tipoSessaoData);
};

/**
 * Atualiza um Tipo de Sessão existente.
 * PUT /api/harmonia/tipos-sessao/:id
 * @param {string} id - O ID do Tipo de Sessão a ser atualizado.
 * @param {{ nome: string }} tipoSessaoData - Os novos dados para o tipo de sessão.
 */
export const updateTipoSessao = (id, tipoSessaoData) => {
  return apiClient.put(`/harmonia/tipos-sessao/${id}`, tipoSessaoData);
};

/**
 * Deleta um Tipo de Sessão.
 * DELETE /api/harmonia/tipos-sessao/:id
 * @param {string} id - O ID do Tipo de Sessão a ser deletado.
 */
export const deleteTipoSessao = (id) => {
  return apiClient.delete(`/harmonia/tipos-sessao/${id}`);
};

// =============================================================================
// == Funções para Playlists ==
// =============================================================================

/**
 * Busca todas as Playlists e suas músicas.
 * GET /api/harmonia/playlists
 * CORREÇÃO: Retorna a promessa completa do Axios.
 */
export const getPlaylists = () => {
  return apiClient.get("/harmonia/playlists");
};

/**
 * Cria uma nova Playlist.
 * POST /api/harmonia/playlists
 * @param {{ nome: string }} playlistData - Os dados da nova playlist.
 */
export const createPlaylist = (playlistData) => {
  return apiClient.post("/harmonia/playlists", playlistData);
};

/**
 * Atualiza uma Playlist existente (ex: renomear).
 * PUT /api/harmonia/playlists/:id
 * @param {string} id - O ID da playlist a ser atualizada.
 * @param {{ nome: string }} playlistData - Os novos dados para a playlist.
 */
export const updatePlaylist = (id, playlistData) => {
  return apiClient.put(`/harmonia/playlists/${id}`, playlistData);
};

/**
 * Deleta uma Playlist.
 * DELETE /api/harmonia/playlists/:id
 * @param {string} id - O ID da playlist a ser deletada.
 */
export const deletePlaylist = (id) => {
  return apiClient.delete(`/harmonia/playlists/${id}`);
};

// =============================================================================
// == Funções para Músicas ==
// =============================================================================

/**
 * Busca todas as Músicas.
 * GET /api/harmonia/musicas
 * CORREÇÃO: Retorna a promessa completa do Axios.
 */
export const getMusicas = () => {
  return apiClient.get("/harmonia/musicas");
};

/**
 * Faz upload de uma nova música e a associa a uma playlist.
 * POST /api/harmonia/musicas
 * @param {FormData} formData - O formulário contendo o arquivo de áudio e o playlistId.
 */
export const createMusica = (formData) => {
  return apiClient.post("/harmonia/musicas", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Deleta uma música e seu arquivo físico.
 * DELETE /api/harmonia/musicas/:id
 * @param {string} id - O ID da música a ser deletada.
 */
export const deleteMusica = (id) => {
  return apiClient.delete(`/harmonia/musicas/${id}`);
};

// =============================================================================
// == Funções para Sequência Musical ==
// =============================================================================

/**
 * Busca a sequência ordenada de playlists para o Player.
 * GET /api/harmonia/sequencia/:tipoSessaoId
 * @param {string} tipoSessaoId - O ID do Tipo de Sessão.
 * CORREÇÃO: Retorna a promessa completa do Axios.
 */
export const getSequencia = (tipoSessaoId) => {
  return apiClient.get(`/harmonia/sequencia/${tipoSessaoId}`);
};

/**
 * Define ou atualiza a sequência de playlists para um Tipo de Sessão.
 * POST /api/harmonia/tipos-sessao/:tipoSessaoId/playlists
 * @param {string} tipoSessaoId - O ID do Tipo de Sessão.
 * @param {Array<{playlistId: string, ordem: number}>} payload - O array com as playlists e suas ordens.
 */
export const setSequenciaPlaylist = (tipoSessaoId, payload) => {
  return apiClient.post(`/harmonia/tipos-sessao/${tipoSessaoId}/playlists`, {
    playlists: payload,
  });
};

/**
 * Atualiza os dados de uma música (ex: título).
 * @param {string} id - O ID da música a ser atualizada.
 * @param {{ titulo: string }} musicaData - Os novos dados da música.
 */
export const updateMusica = (id, musicaData) => {
  return apiClient.put(`/harmonia/musicas/${id}`, musicaData);
};

/**
 * Atualiza apenas as músicas dentro de uma playlist existente.
 * Usado na página de "Gestão de Playlists".
 * @param {string} playlistId - O ID da playlist.
 * @param {string[]} musicaIds - Um array com os IDs das músicas na nova ordem.
 */
export const updateMusicasPlaylist = (playlistId, musicaIds) => {
  return apiClient.put(`/harmonia/playlists/${playlistId}/musicas`, {
    musicaIds,
  });
};
