import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import { getSessions, createSession } from "../../../services/sessionService";
import Modal from "../../../components/modal/Modal";
import SessionForm from "./SessionForm";
import "./SessionsPage.css";
import "../../styles/TableStyles.css";

// 1. IMPORTAMOS AS NOSSAS FUNÇÕES DE NOTIFICAÇÃO
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const SessionsPage = () => {
  const {
    data: sessions,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getSessions);

  // 2. O ESTADO DE ERRO PARA AÇÕES NÃO É MAIS NECESSÁRIO
  // const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManageSessions =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSaveSession = async (formData) => {
    try {
      await createSession(formData);
      refetch();
      setIsModalOpen(false);
      // 3. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
      showSuccessToast("Sessão registrada com sucesso!");
    } catch (err) {
      console.error(err);
      // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
      const errorMsg =
        err.response?.data?.message || "Erro ao registar a sessão.";
      showErrorToast(errorMsg);
    }
  };

  if (isLoading)
    return <div className="table-page-container">A carregar sessões...</div>;

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Sessões Maçónicas</h1>
        {canManageSessions && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-action btn-approve"
          >
            Registar Nova Sessão
          </button>
        )}
      </div>

      {/* 5. A EXIBIÇÃO DE ERRO É SIMPLIFICADA */}
      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="sessions-list">
        {!isLoading && sessions.length === 0 ? (
          <p>Nenhuma sessão registada.</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="session-card">
              <div className="session-card-header">
                <h3>
                  {session.tipoSessao} de {session.subtipoSessao}
                </h3>
                <span className="session-date">
                  {new Date(session.dataSessao).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </span>
              </div>
              <div className="session-card-body">
                <p>
                  <strong>Presentes:</strong> {session.presentes?.length || 0}{" "}
                  Obreiros
                </p>
                <p>
                  <strong>Visitantes:</strong> {session.visitantes?.length || 0}
                </p>
                {session.ata ? (
                  <a
                    href={`/uploads/${session.ata.path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-action btn-edit"
                    style={{ textDecoration: "none" }}
                  >
                    Ver Ata (Nº {session.ata.numero}/{session.ata.ano})
                  </a>
                ) : (
                  <p>Ata não disponível</p>
                )}
              </div>
            </div>
          ))
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
