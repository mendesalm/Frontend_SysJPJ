import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // --- 1. Importar o componente Slider ---
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getSessions,
  createSession,
  deleteSession,
} from "../../../services/sessionService";
import Modal from "../../../components/modal/Modal";
import SessionForm from "./SessionForm.jsx";
import "./SessionsPage.css"; // O CSS será atualizado
import "../../styles/TableStyles.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../utils/notifications.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const formatDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "Data inválida";
  }
  return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const SessionsPage = () => {
  // --- 2. Busca todos os itens para o carrossel, removendo a paginação ---
  const params = useMemo(
    () => ({ page: 1, limit: 999, sortBy: "dataSessao", order: "DESC" }),
    []
  );

  const {
    data: sessions,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getSessions, [params]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const allowedRolesForSessionCreation = [
    "Secretário",
    "Secretário Adjunto",
    "Chanceler",
    "Chanceler Adjunto",
  ];
  const canCreateSession =
    user?.credencialAcesso === "Webmaster" ||
    allowedRolesForSessionCreation.includes(user?.cargoAtual);

  const allowedRolesForBalaustreEdit = ["Secretário", "Secretário Adjunto"];
  const canEditBalaustre =
    user?.credencialAcesso === "Webmaster" ||
    allowedRolesForBalaustreEdit.includes(user?.cargoAtual);

  const canDeleteSession = canCreateSession;

  const handleSaveSession = async (formData) => {
    try {
      await createSession(formData);
      showSuccessToast("Sessão registrada com sucesso!");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao registrar a sessão."
      );
    }
  };

  const handleDeleteSession = async (sessionId) => {
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

  // --- 3. Configurações para o carrossel ---
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    initialSlide: 0, // A sessão mais recente será a primeira (ativa)
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Sessões</h1>
        {canCreateSession && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-action btn-approve"
          >
            Registar Nova Sessão
          </button>
        )}
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      {/* --- 4. Renderização do Carrossel em vez da lista simples --- */}
      <div className="carousel-container">
        {isLoading ? (
          <p>A carregar sessões...</p>
        ) : !sessions || sessions.length === 0 ? (
          <p>Nenhuma sessão registada.</p>
        ) : (
          <Slider {...sliderSettings}>
            {sessions
              .filter((session) => session && session.id)
              .map((session) => (
                <div key={session.id} className="session-slide">
                  <div className="session-card">
                    <div className="session-card-header">
                      <h3>
                        {session.tipoSessao} de {session.subtipoSessao}
                      </h3>
                      <span className="session-date">
                        {formatDate(session.dataSessao)}
                      </span>
                    </div>
                    <div className="session-card-body">
                      <p>
                        <strong>Presentes:</strong>{" "}
                        {session.presentesCount || 0} Obreiros
                      </p>
                      <p>
                        <strong>Visitantes:</strong>{" "}
                        {session.visitantesCount || 0}
                      </p>

                      {session.Balaustre ? (
                        <div className="balaustre-actions">
                          <a
                            href={`${
                              import.meta.env.VITE_BACKEND_URL ||
                              "http://localhost:3001"
                            }${session.Balaustre.caminhoPdfLocal}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-action btn-edit"
                          >
                            Ver PDF
                          </a>
                          {canEditBalaustre && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/balaustres/editar/${session.Balaustre.id}`
                                )
                              }
                              className="btn-action btn-approve"
                            >
                              Editar Balaústre
                            </button>
                          )}
                        </div>
                      ) : (
                        <p>Balaústre não disponível.</p>
                      )}
                    </div>
                    {canDeleteSession && (
                      <div className="session-card-footer">
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="btn-action btn-delete"
                          title="Apagar Sessão"
                        >
                          Apagar Sessão
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
        />
      </Modal>
    </div>
  );
};

export default SessionsPage;
