import React, { useState, useEffect, useRef } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  createMusica,
  deleteMusica,
} from "../../../services/harmoniaService";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import "./GestaoPlaylistsPage.css";
import "../../../assets/styles/FormStyles.css";

const MusicNoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const GestaoPlaylistsPage = () => {
  const {
    data: playlists,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const fileInputRef = useRef(null);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim())
      return showErrorToast("O nome da playlist não pode estar vazio.");
    try {
      await createPlaylist({ nome: newPlaylistName });
      setNewPlaylistName("");
      refetch();
      showSuccessToast("Playlist criada com sucesso!");
    } catch (err) {
      showErrorToast("Erro ao criar playlist.");
      console.error(err);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (
      window.confirm(
        "Tem certeza que deseja apagar esta playlist e TODAS as suas músicas? A ação não pode ser desfeita."
      )
    ) {
      try {
        await deletePlaylist(playlistId);
        if (selectedPlaylist?.id === playlistId) {
          setSelectedPlaylist(null);
        }
        refetch();
        showSuccessToast("Playlist apagada com sucesso.");
      } catch (err) {
        showErrorToast("Erro ao apagar playlist.");
        console.error(err);
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedPlaylist) return;

    const formData = new FormData();
    formData.append("audioFile", file);
    formData.append("titulo", file.name.replace(/\.[^/.]+$/, ""));
    formData.append("playlistId", selectedPlaylist.id);

    try {
      await createMusica(formData);
      refetch();
      showSuccessToast("Música adicionada com sucesso!");
    } catch (err) {
      showErrorToast("Erro ao adicionar música.");
      console.error(err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteMusica = async (musicaId) => {
    if (window.confirm("Tem certeza que deseja apagar esta música?")) {
      try {
        await deleteMusica(musicaId);
        refetch();
        showSuccessToast("Música apagada.");
      } catch (err) {
        showErrorToast("Erro ao apagar música.");
        console.error(err);
      }
    }
  };

  // Atualiza a playlist selecionada com os dados mais recentes após um refetch
  useEffect(() => {
    if (selectedPlaylist && playlists) {
      const updatedPlaylist = playlists.find(
        (p) => p.id === selectedPlaylist.id
      );
      setSelectedPlaylist(updatedPlaylist);
    }
    // --- INÍCIO DA CORREÇÃO ---
  }, [playlists, selectedPlaylist]);
  // --- FIM DA CORREÇÃO ---

  return (
    <div className="gestao-container">
      <div className="table-header">
        <h1>Gestão de Playlists e Músicas</h1>
      </div>
      {error && <p className="error-message">{error}</p>}

      <div className="gestao-layout">
        {/* Coluna da Esquerda: Playlists */}
        <div className="playlists-column">
          <h3>Playlists</h3>
          <form onSubmit={handleCreatePlaylist} className="new-playlist-form">
            <input
              type="text"
              className="form-input"
              placeholder="Nome da nova playlist..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              +
            </button>
          </form>
          <div className="playlists-grid">
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              (playlists || []).map((p) => (
                <div
                  key={p.id}
                  className={`playlist-card ${
                    selectedPlaylist?.id === p.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedPlaylist(p)}
                >
                  <div className="playlist-card-header">
                    <span className="playlist-name">{p.nome}</span>
                    <button
                      className="btn-delete-playlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlaylist(p.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="playlist-card-body">
                    <MusicNoteIcon />
                    <span className="track-count">
                      {p.musicas?.length || 0} músicas
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna da Direita: Músicas da Playlist Selecionada */}
        <div className="musicas-column">
          {selectedPlaylist ? (
            <>
              <h3>Músicas em &quot;{selectedPlaylist.nome}&quot;</h3>
              <div className="musicas-list">
                {selectedPlaylist.musicas &&
                selectedPlaylist.musicas.length > 0 ? (
                  selectedPlaylist.musicas.map((m) => (
                    <div key={m.id} className="musica-item">
                      <span>{m.titulo}</span>
                      <button
                        className="btn-delete-musica"
                        onClick={() => handleDeleteMusica(m.id)}
                      >
                        Apagar
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Esta playlist está vazia.</p>
                )}
              </div>
              <div className="upload-section">
                <label htmlFor="upload-musica" className="btn btn-primary">
                  + Adicionar Música
                </label>
                <input
                  type="file"
                  id="upload-musica"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="audio/*"
                />
              </div>
            </>
          ) : (
            <div className="placeholder-musicas">
              <p>
                Selecione uma playlist à esquerda para ver e adicionar suas
                músicas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestaoPlaylistsPage;
