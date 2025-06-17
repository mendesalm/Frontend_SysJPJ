import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import { getSessions, createSession } from "../../../services/sessionService";
import Modal from "../../../components/modal/Modal";
import SessionForm from "./SessionForm";
import "./SessionsPage.css";
import "../../styles/TableStyles.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div
      className="pagination-controls"
      style={{
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>
    </div>
  );
};

const SessionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({ page: currentPage, limit: 9 }),
    [currentPage]
  );

  // --- CORREÇÃO AQUI ---
  // O hook agora retorna 'data' e 'pagination' de forma explícita
  const {
    data: sessions,
    pagination,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getSessions, [params]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManageSessions =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSaveSession = async (formData) => {
    try {
      await createSession(formData);
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        refetch();
      }
      setIsModalOpen(false);
      showSuccessToast("Sessão registrada com sucesso!");
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao registar a sessão."
      );
    }
  };

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

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="sessions-list">
        {isLoading ? (
          <p>A carregar sessões...</p>
        ) : !sessions || sessions.length === 0 ? (
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

      {pagination && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

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
