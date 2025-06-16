import React, { useState, useEffect, useRef } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getTiposSessao,
  getSequencia,
} from "../../../services/harmoniaService";
import apiClient from "../../../services/apiClient";
import { showErrorToast } from "../../../utils/notifications"; // Para feedback de erro
import "./PlayerPage.css";

const MusicIcon = () => (
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

const PlayerHarmoniaPage = () => {
  const { data: tiposSessao = [] } = useDataFetching(getTiposSessao);
  const [selectedTipoSessaoId, setSelectedTipoSessaoId] = useState("");
  const [sequencia, setSequencia] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [isLoadingSequencia, setIsLoadingSequencia] = useState(false);
  const [error, setError] = useState(null); // Novo estado para erros
  const audioRef = useRef(null);
  const carrosselRef = useRef(null);

  const currentSong =
    sequencia.length > 0 ? sequencia[indiceAtual]?.musicaSorteada : null;

  useEffect(() => {
    if (!selectedTipoSessaoId) {
      setSequencia([]);
      setError(null);
      return;
    }

    setIsLoadingSequencia(true);
    setError(null); // Limpa erros anteriores

    getSequencia(selectedTipoSessaoId)
      .then((res) => {
        // --- CORREÇÃO CRÍTICA AQUI ---
        // 'res' já é o objeto de dados. Acessamos 'res.sequencia' diretamente.
        if (res && res.sequencia) {
          setSequencia(res.sequencia);
          setIndiceAtual(0);
        } else {
          // Se a API não retornar uma sequência, tratamos como erro.
          setSequencia([]);
          setError("Sequência não encontrada ou está vazia.");
          showErrorToast("A sequência para este ritual não foi encontrada.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Falha ao carregar a sequência.");
        showErrorToast("Falha ao carregar a sequência.");
      })
      .finally(() => setIsLoadingSequencia(false));
  }, [selectedTipoSessaoId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentSong && audio && currentSong.path) {
      const baseURL = apiClient.defaults.baseURL.startsWith("http")
        ? apiClient.defaults.baseURL
        : window.location.origin;
      const finalPath = `${baseURL}/${currentSong.path}`.replace(
        /([^:]\/)\/+/g,
        "$1"
      );

      audio.src = finalPath;
      audio.play().catch((e) => console.error("Erro ao tocar áudio:", e));
    } else if (audio) {
      audio.pause();
      audio.src = "";
    }
  }, [currentSong]);

  useEffect(() => {
    if (carrosselRef.current && carrosselRef.current.children[indiceAtual]) {
      const cardAtivo = carrosselRef.current.children[indiceAtual];
      cardAtivo.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [indiceAtual, sequencia]);

  const handleNext = () => {
    if (indiceAtual < sequencia.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    }
  };

  // --- NOVA FUNÇÃO PARA VOLTAR ---
  const handlePrev = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(indiceAtual - 1);
    }
  };

  const handleStopAndAdvance = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    handleNext();
  };

  const selectTrack = (index) => {
    setIndiceAtual(index);
  };

  return (
    <div className="harmonia-player-container">
      <div className="harmonia-player-card">
        <div className="player-header">
          <h2>Player de Harmonia</h2>
          <select
            className="form-select"
            value={selectedTipoSessaoId}
            onChange={(e) => setSelectedTipoSessaoId(e.target.value)}
            disabled={isLoadingSequencia}
          >
            <option value="">-- Selecione o Ritual do Dia --</option>
            {tiposSessao.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="now-playing-area">
          <div className="album-art">
            <MusicIcon />
          </div>
          <div className="track-info">
            <div className="track-title">
              {currentSong?.titulo || "Nenhuma música selecionada"}
            </div>
            <div className="track-playlist">
              {sequencia[indiceAtual]?.playlist.nome || "Aguardando seleção"}
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          controls
          onEnded={handleNext}
          className="main-audio-player"
          key={currentSong?.id}
        />

        {/* --- CONTROLES MANUAIS ATUALIZADOS --- */}
        {sequencia.length > 0 && (
          <div className="manual-controls">
            <button
              onClick={handlePrev}
              className="btn-nav"
              disabled={indiceAtual === 0}
            >
              Anterior
            </button>
            <button
              onClick={handleStopAndAdvance}
              className="btn-stop-advance"
              disabled={indiceAtual >= sequencia.length - 1}
            >
              Parar e Avançar
            </button>
            <button
              onClick={handleNext}
              className="btn-nav"
              disabled={indiceAtual >= sequencia.length - 1}
            >
              Próximo
            </button>
          </div>
        )}

        <div className="carrossel-container-wrapper">
          <div className="carrossel-container" ref={carrosselRef}>
            {isLoadingSequencia ? (
              <p style={{ textAlign: "center", width: "100%" }}>
                Carregando...
              </p>
            ) : error ? (
              <p className="error-message">{error}</p> // Exibe mensagem de erro
            ) : sequencia.length === 0 && selectedTipoSessaoId ? (
              <p className="info-message">
                Nenhuma sequência encontrada para este ritual.
              </p>
            ) : (
              sequencia.map((item, index) => (
                <div
                  key={`${item.playlist.id}-${index}`}
                  className={`carrossel-card ${
                    index === indiceAtual ? "active" : ""
                  }`}
                  onClick={() => selectTrack(index)}
                >
                  <div className="carrossel-card-title">
                    {item.playlist.nome}
                  </div>
                  <div className="carrossel-card-song">
                    {item.musicaSorteada?.titulo || "(Silêncio Programado)"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHarmoniaPage;
