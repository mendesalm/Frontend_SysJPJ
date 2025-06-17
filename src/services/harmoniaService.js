import apiClient from "./apiClient";

// =============================================================================
// == Funções para Tipos de Sessão ==
// =============================================================================

/**
 * Busca todos os Tipos de Sessão.
 * GET /api/harmonia/tipos-sessao
 */
export const getTiposSessao = async () => {
  const response = await apiClient.get("/harmonia/tipos-sessao");
  return response.data;
};

/**
 * Cria um novo Tipo de Sessão.
 * POST /api/harmonia/tipos-sessao
 * @param {{ nome: string }} tipoSessaoData - Os dados do novo tipo de sessão.
 */
export const createTipoSessao = async (tipoSessaoData) => {
  const response = await apiClient.post(
    "/harmonia/tipos-sessao",
    tipoSessaoData
  );
  return response.data;
};

/**
 * Atualiza um Tipo de Sessão existente.
 * PUT /api/harmonia/tipos-sessao/:id
 * @param {string} id - O ID do Tipo de Sessão a ser atualizado.
 * @param {{ nome: string }} tipoSessaoData - Os novos dados para o tipo de sessão.
 */
export const updateTipoSessao = async (id, tipoSessaoData) => {
  const response = await apiClient.put(
    `/harmonia/tipos-sessao/${id}`,
    tipoSessaoData
  );
  return response.data;
};

/**
 * Deleta um Tipo de Sessão.
 * DELETE /api/harmonia/tipos-sessao/:id
 * @param {string} id - O ID do Tipo de Sessão a ser deletado.
 */
export const deleteTipoSessao = async (id) => {
  const response = await apiClient.delete(`/harmonia/tipos-sessao/${id}`);
  return response.data;
};

// =============================================================================
// == Funções para Playlists ==
// =============================================================================

/**
 * Busca todas as Playlists e suas músicas.
 * GET /api/harmonia/playlists
 */
export const getPlaylists = async () => {
  const response = await apiClient.get("/harmonia/playlists");
  return response.data;
};

/**
 * Cria uma nova Playlist.
 * POST /api/harmonia/playlists
 * @param {{ nome: string }} playlistData - Os dados da nova playlist.
 */
export const createPlaylist = async (playlistData) => {
  const response = await apiClient.post("/harmonia/playlists", playlistData);
  return response.data;
};

/**
 * Atualiza uma Playlist existente (ex: renomear).
 * PUT /api/harmonia/playlists/:id
 * @param {string} id - O ID da playlist a ser atualizada.
 * @param {{ nome: string }} playlistData - Os novos dados para a playlist.
 */
export const updatePlaylist = async (id, playlistData) => {
  const response = await apiClient.put(
    `/harmonia/playlists/${id}`,
    playlistData
  );
  return response.data;
};

/**
 * Deleta uma Playlist.
 * DELETE /api/harmonia/playlists/:id
 * @param {string} id - O ID da playlist a ser deletada.
 */
export const deletePlaylist = async (id) => {
  const response = await apiClient.delete(`/harmonia/playlists/${id}`);
  return response.data;
};

// =============================================================================
// == Funções para Músicas ==
// =============================================================================

/**
 * Busca todas as Músicas (necessário para a página de Gestão de Playlists).
 * GET /api/harmonia/musicas (Endpoint inferido, mas necessário para a UI)
 */
export const getMusicas = async () => {
  const response = await apiClient.get("/harmonia/musicas");
  return response.data;
};

/**
 * Faz upload de uma nova música e a associa a uma playlist.
 * POST /api/harmonia/musicas
 * @param {FormData} formData - O formulário contendo o arquivo de áudio e o playlistId.
 */
export const createMusica = async (formData) => {
  const response = await apiClient.post("/harmonia/musicas", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Deleta uma música e seu arquivo físico.
 * DELETE /api/harmonia/musicas/:id
 * @param {string} id - O ID da música a ser deletada.
 */
export const deleteMusica = async (id) => {
  const response = await apiClient.delete(`/harmonia/musicas/${id}`);
  return response.data;
};

// =============================================================================
// == Funções para Sequência Musical ==
// =============================================================================

/**
 * Busca a sequência ordenada de playlists para o Player.
 * GET /api/harmonia/sequencia/:tipoSessaoId
 * @param {string} tipoSessaoId - O ID do Tipo de Sessão.
 */
export const getSequencia = async (tipoSessaoId) => {
  const response = await apiClient.get(`/harmonia/sequencia/${tipoSessaoId}`);
  return response.data;
};

/**
 * Define ou atualiza a sequência de playlists para um Tipo de Sessão.
 * POST /api/harmonia/tipos-sessao/:tipoSessaoId/playlists
 * @param {string} tipoSessaoId - O ID do Tipo de Sessão.
 * @param {Array<{playlistId: string, ordem: number}>} payload - O array com as playlists e suas ordens.
 */
export const setSequenciaPlaylist = async (tipoSessaoId, payload) => {
  const response = await apiClient.post(
    `/harmonia/tipos-sessao/${tipoSessaoId}/playlists`,
    { playlists: payload }
  );
  return response.data;
};

/**
 * Atualiza os dados de uma música (ex: título).
 * @param {string} id - O ID da música a ser atualizada.
 * @param {{ titulo: string }} musicaData - Os novos dados da música.
 */
export const updateMusica = async (id, musicaData) => {
  const response = await apiClient.put(`/harmonia/musicas/${id}`, musicaData);
  return response.data;
};
// NOTA: A função abaixo pode ser redundante se o backend não tiver o endpoint específico
// /playlists/:id/musicas. Se o update de músicas for feito em outra rota, esta pode ser removida.
/**
 * Atualiza apenas as músicas dentro de uma playlist existente.
 * Usado na página de "Gestão de Playlists".
 * @param {string} playlistId - O ID da playlist.
 * @param {string[]} musicaIds - Um array com os IDs das músicas na nova ordem.
 */
export const updateMusicasPlaylist = async (playlistId, musicaIds) => {
  const response = await apiClient.put(
    `/harmonia/playlists/${playlistId}/musicas`,
    {
      musicaIds,
    }
  );
  return response.data;
};
