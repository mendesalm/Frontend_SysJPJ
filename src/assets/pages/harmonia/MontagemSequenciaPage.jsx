import React, { useState, useEffect } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getTiposSessao,
  createTipoSessao,
  deleteTipoSessao,
  getPlaylists,
  updateSequenciaPlaylist,
} from "../../../services/harmoniaService";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import "./MontagemSequenciaPage.css"; // Importando o novo CSS
import "../../../assets/styles/FormStyles.css"; // Para os inputs e botões

const MontagemSequenciaPage = () => {
  const {
    data: tiposSessao = [],
    isLoading: loadingTipos,
    refetch: refetchTiposSessao,
  } = useDataFetching(getTiposSessao);
  const { data: allPlaylists = [], isLoading: loadingPlaylists } =
    useDataFetching(getPlaylists);

  const [selectedTipoSessao, setSelectedTipoSessao] = useState(null);
  const [sequencia, setSequencia] = useState([]);
  const [newTipoSessaoName, setNewTipoSessaoName] = useState("");

  useEffect(() => {
    const playlistsDaSequencia =
      selectedTipoSessao?.playlists?.sort(
        (a, b) => a.TipoSessaoPlaylists.ordem - b.TipoSessaoPlaylists.ordem
      ) || [];
    setSequencia(playlistsDaSequencia);
  }, [selectedTipoSessao]);

  const handleSelectTipoSessao = (tipo) => {
    const tipoSessaoCompleto = tiposSessao.find((t) => t.id === tipo.id);
    setSelectedTipoSessao(tipoSessaoCompleto);
  };

  const handleCreateTipoSessao = async (e) => {
    e.preventDefault();
    if (!newTipoSessaoName.trim())
      return showErrorToast("O nome não pode estar vazio.");
    try {
      await createTipoSessao({ nome: newTipoSessaoName });
      setNewTipoSessaoName("");
      refetchTiposSessao();
      showSuccessToast("Tipo de Sessão criado com sucesso!");
    } catch (error) {
      showErrorToast("Erro ao criar o Tipo de Sessão.");
      console.error(error);
    }
  };

  const handleDeleteTipoSessao = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este Tipo de Sessão?")) {
      try {
        await deleteTipoSessao(id);
        setSelectedTipoSessao(null);
        refetchTiposSessao();
        showSuccessToast("Tipo de Sessão apagado.");
      } catch (error) {
        showErrorToast("Erro ao apagar o Tipo de Sessão.");
        console.error(error);
      }
    }
  };

  const handleAddPlaylist = (playlist) => {
    if (sequencia.find((p) => p.id === playlist.id)) return;
    setSequencia((prev) => [...prev, playlist]);
  };

  const handleRemovePlaylist = (playlistId) => {
    setSequencia((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const handleSaveSequencia = async () => {
    if (!selectedTipoSessao)
      return showErrorToast("Nenhum Tipo de Sessão selecionado.");
    const payload = sequencia.map((playlist, index) => ({
      playlistId: playlist.id,
      ordem: index + 1,
    }));
    try {
      await updateSequenciaPlaylist(selectedTipoSessao.id, payload);
      showSuccessToast("Sequência salva com sucesso!");
      refetchTiposSessao(); // Para atualizar a contagem de playlists no tipo de sessão
    } catch (error) {
      showErrorToast("Erro ao salvar sequência.");
      console.error(error);
    }
  };

  const playlistsDisponiveis = allPlaylists.filter(
    (p) => !sequencia.some((s) => s.id === p.id)
  );
  const isLoading = loadingTipos || loadingPlaylists;

  return (
    <div className="montagem-container">
      <div className="montagem-header">
        <h1>Montagem de Sequências</h1>
      </div>
      {isLoading && <p>Carregando dados...</p>}

      <div className="montagem-layout">
        {/* Coluna da Esquerda: Gestão de Tipos de Sessão */}
        <div className="tipos-sessao-column">
          <h3>Tipos de Sessão</h3>
          <form
            onSubmit={handleCreateTipoSessao}
            className="new-tiposessao-form"
          >
            <input
              type="text"
              className="form-input"
              placeholder="Novo tipo de sessão..."
              value={newTipoSessaoName}
              onChange={(e) => setNewTipoSessaoName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              +
            </button>
          </form>
          <div className="tipos-sessao-list">
            {(tiposSessao || []).map((t) => (
              <div
                key={t.id}
                className={`sessao-item ${
                  selectedTipoSessao?.id === t.id ? "active" : ""
                }`}
                onClick={() => handleSelectTipoSessao(t)}
              >
                <span>
                  {t.nome} ({(t.playlists || []).length} playlists)
                </span>
                <button
                  className="btn-delete-playlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTipoSessao(t.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna da Direita: Montagem da Sequência */}
        <div className="sequencia-column">
          {selectedTipoSessao ? (
            <>
              <h3>Sequência para "{selectedTipoSessao.nome}"</h3>
              <div className="sequencia-editor">
                <div className="playlist-list-container">
                  <h4>Playlists Disponíveis</h4>
                  {playlistsDisponiveis.map((p) => (
                    <div key={p.id} className="playlist-item">
                      <span>{p.nome}</span>
                      <button
                        className="btn-action btn-approve"
                        onClick={() => handleAddPlaylist(p)}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
                <div className="playlist-list-container">
                  <h4>Sequência Atual</h4>
                  {sequencia.map((p, index) => (
                    <div key={p.id} className="playlist-item">
                      <span>
                        {index + 1}. {p.nome}
                      </span>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleRemovePlaylist(p.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ marginTop: "1.5rem", width: "100%" }}
                onClick={handleSaveSequencia}
              >
                Salvar Sequência
              </button>
            </>
          ) : (
            <div className="placeholder-musicas">
              <p>
                Selecione um Tipo de Sessão à esquerda para montar sua sequência
                musical.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MontagemSequenciaPage;
