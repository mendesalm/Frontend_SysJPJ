import React, { useState } from "react";
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
import "./SessionsPage.css";
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
  const fetchParams = {
    page: 1,
    limit: 999,
    sortBy: "dataSessao",
    order: "DESC",
  };
  const {
    data: sessions,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getSessions, [fetchParams]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lógica de permissão para DELETAR ainda pode ser útil no frontend
  const canDeleteSession =
    user?.credencialAcesso === "Webmaster" ||
    ["Secretário", "Secretário Adjunto"].includes(user?.cargoAtual);

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

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    initialSlide: 0,
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
        {/* CORREÇÃO: A condição 'canCreateSession' foi removida, o botão agora é sempre renderizado */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-action btn-approve"
        >
          Registar Nova Sessão
        </button>
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

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
                    </div>
                    <div className="session-card-footer management-footer">
                      <button
                        onClick={() =>
                          navigate(`/sessoes/${session.id}`, {
                            state: { balaustreId: session.Balaustre?.id },
                          })
                        }
                        className="btn btn-primary"
                      >
                        Gerenciar Sessão
                      </button>
                      {canDeleteSession && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="btn-action btn-delete"
                          title="Apagar Sessão"
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "#b91c1c",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            fontSize: "1rem",
                            lineHeight: "1",
                          }}
                        >
                          X
                        </button>
                      )}
                    </div>
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
