import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getSessions,
  createSession,
  deleteSession,
} from "../../../services/sessionService";
import Modal from "../../../components/modal/Modal";
import SessionForm from "./SessionForm.jsx";
import LoadingOverlay from "../../../components/layout/LoadingOverlay";
import SessionStatusFilter from "./SessionStatusFilter.jsx";
import "./SessionsPage.css";
import "./SessionStatusFilter.css";
import "../../styles/TableStyles.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../utils/notifications.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaTrash,
  FaLink,
  FaCoins,
  FaUtensils,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import moment from "moment";
import apiClient from "../../../services/apiClient";

const SessionsPage = () => {
  const [statusFilter, setStatusFilter] = useState("Agendada");

  useEffect(() => {
    console.log("Current status filter:", statusFilter);
  }, [statusFilter]);
  const fetchParams = useMemo(
    () => ({
      page: 1,
      limit: 50,
      sortBy: "dataSessao",
      order: "DESC",
      status: statusFilter,
    }),
    [statusFilter]
  );

  const fetcher = useCallback(() => getSessions(fetchParams), [fetchParams]);

  const {
    data: sessions,
    isLoading: isLoadingSessions,
    error: fetchError,
    refetch,
  } = useDataFetching(fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const canDeleteSession =
    user?.credencialAcesso === "Webmaster" ||
    ["Secretário", "Secretário Adjunto"].includes(user?.cargoAtual);

  const handleSaveSession = async (formData) => {
    setIsCreatingSession(true);
    try {
      const dadosParaEnviar = { ...formData };
      if (dadosParaEnviar.dataSessao) {
        dadosParaEnviar.dataSessao = moment(dadosParaEnviar.dataSessao).format('YYYY-MM-DD');
      }

      await createSession(dadosParaEnviar);
      showSuccessToast("Sessão registrada com sucesso!");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao registrar a sessão."
      );
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Tem a certeza que deseja apagar esta sessão? Esta ação não pode ser desfeita e irá remover também o balaústre associado."
      )
    ) {
      try {
        await deleteSession(sessionId);
        showSuccessToast("Sessão apagada com sucesso!");
        refetch();
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Erro ao apagar a sessão."
        );
      }
    }
  };

  const getFileUrl = (path) => {
    if (!path) return "#";
    const baseURL = apiClient.defaults.baseURL.startsWith("http")
      ? apiClient.defaults.baseURL
      : window.location.origin;
    return `${baseURL}/${path}`.replace("/api/", "/");
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="sessions-page">
      <LoadingOverlay
        isLoading={isCreatingSession}
        message="Criando sessão e gerando documentos, por favor aguarde..."
      />

      <div className="table-header">
        <h1>Gestão de Sessões</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-action btn-approve"
          style={{ padding: "12px 24px", borderRadius: "8px" }}
        >
          Registar Nova Sessão
        </button>
      </div>

      
      <SessionStatusFilter
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="carousel-container">
        {isLoadingSessions ? (
          <p>A carregar sessões...</p>
        ) : !sessions || sessions.length === 0 ? (
          <p>Nenhuma sessão registada.</p>
        ) : (
          <Slider {...sliderSettings}>
            {sessions
              .filter((session) => session && session.id)
              .map((session) => {
                // ATUALIZADO: Lógica simplificada usando os novos campos da API
                const tituloSessao =
                  session.classeSessao || `Sessão ${session.tipoSessao}`;

                let infoJantar = "A definir.";
                if (session.responsavelJantar) {
                  const esposaResponsavel =
                    session.responsavelJantar.familiares?.find(
                      (f) => f.parentesco === "Cônjuge"
                    );
                  infoJantar = `Oferecido por Ir. ${session.responsavelJantar.NomeCompleto}`;
                  if (esposaResponsavel) {
                    infoJantar += ` e Cunhada ${esposaResponsavel.nomeCompleto}`;
                  }
                }

                return (
                  <div key={session.id} className="session-slide">
                    <div className="session-card-neumorphic">
                      <div className="session-card-header">
                        <div className="date-box">
                          <span className="month">
                            {moment(session.dataSessao)
                              .format("MMM")
                              .toUpperCase()}
                          </span>
                          <span className="day">
                            {moment(session.dataSessao).format("DD")}
                          </span>
                        </div>
                        <div className="header-info">
                          <h3>{tituloSessao}</h3>
                          <span
                            className={`session-status status-${(
                              session.status || "agendada"
                            ).toLowerCase()}`}
                          >
                            {session.status || "Agendada"}
                          </span>
                        </div>
                        {canDeleteSession && session.status === "Agendada" && (
                          <button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="btn-action btn-delete session-delete-btn"
                            title="Apagar Sessão"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <div className="session-card-body">
                        <div className="info-item">
                          <FaLink />
                          <span>
                            Balaústre:{" "}
                            {session.Balaustre?.caminhoPdfLocal ? (
                              <a
                                href={getFileUrl(
                                  session.Balaustre.caminhoPdfLocal
                                )}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Ver PDF
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </span>
                        </div>
                        <div className="info-item">
                          <FaCoins />
                          <span>
                            Tronco: R${" "}
                            {parseFloat(
                              session.troncoDeBeneficencia || 0
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="info-item">
                          <FaUtensils />
                          <span>Jantar: {infoJantar}</span>
                        </div>
                        <div className="info-item">
                          <FaUsers />
                          <span>
                            {session.presentesCount || 0} irmãos do quadro e{" "}
                            {session.visitantesCount || 0} visitantes
                          </span>
                        </div>
                      </div>
                      <div className="session-card-footer">
                        <button
                          onClick={() => navigate(`/sessoes/${session.id}`)}
                          className={`btn-manage ${
                            session.status === "Cancelada"
                              ? "btn-manage-disabled"
                              : ""
                          }`}
                          disabled={session.status === "Cancelada"}
                        >
                          {session.status === "Realizada"
                            ? "Ver Detalhes"
                            : "Gerir Sessão"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </Slider>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registar Nova Sessão Maçónica"
      >
        <SessionForm
          onSave={handleSaveSession}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isCreatingSession}
        />
      </Modal>
    </div>
  );
};

export default SessionsPage;
