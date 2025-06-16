import apiClient from "./apiClient";

// --- Endpoints do Player ---
export const getSequencia = (tipoSessaoId) => {
  return apiClient.get(`/harmonia/sequencia/${tipoSessaoId}`);
};

// --- Endpoints de Tipos de Sessão ---
export const getTiposSessao = () => {
  return apiClient.get("/harmonia/tipos-sessao");
};

export const getTipoSessaoById = (id) => {
  return apiClient.get(`/harmonia/tipos-sessao/${id}`);
};

export const createTipoSessao = (data) => {
  return apiClient.post("/harmonia/tipos-sessao", data);
};

export const updateTipoSessao = (id, data) => {
  return apiClient.put(`/harmonia/tipos-sessao/${id}`, data);
};

export const deleteTipoSessao = (id) => {
  return apiClient.delete(`/harmonia/tipos-sessao/${id}`);
};

// --- INÍCIO DA CORREÇÃO ---
export const updateSequenciaPlaylist = (tipoSessaoId, playlists) => {
  // A API espera receber o array de playlists diretamente no corpo da requisição.
  return apiClient.post(
    `/harmonia/tipos-sessao/${tipoSessaoId}/playlists`,
    playlists
  );
};
// --- FIM DA CORREÇÃO ---

// --- Endpoints de Playlists ---
export const getPlaylists = () => {
  return apiClient.get("/harmonia/playlists");
};
export const createPlaylist = (data) => {
  return apiClient.post("/harmonia/playlists", data);
};
export const deletePlaylist = (id) => {
  return apiClient.delete(`/harmonia/playlists/${id}`);
};

// --- Endpoints de Músicas ---
export const createMusica = (formData) => {
  return apiClient.post("/harmonia/musicas", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteMusica = (id) => {
  return apiClient.delete(`/harmonia/musicas/${id}`);
};
