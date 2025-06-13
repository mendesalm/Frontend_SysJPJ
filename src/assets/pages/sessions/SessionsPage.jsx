import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
import { getSessions, createSession } from "../../../services/sessionService";
import Modal from "../../../components/modal/Modal";
import SessionForm from "./SessionForm";
import "./SessionsPage.css";
import "../../styles/TableStyles.css"; // Para estilos do header e botões

const SessionsPage = () => {
  // 2. Lógica de busca de dados simplificada com o hook
  const {
    data: sessions,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getSessions);

  const [actionError, setActionError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManageSessions =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSaveSession = async (formData) => {
    try {
      setActionError("");
      await createSession(formData);
      refetch(); // 3. Atualiza a lista com `refetch`
      setIsModalOpen(false);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Erro ao registar a sessão."
      );
      console.error(err);
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

      {(fetchError || actionError) && (
        <p className="error-message" onClick={() => setActionError("")}>
          {fetchError || actionError}
        </p>
      )}

      <div className="sessions-list">
        {/* 4. Tratamento para estado vazio */}
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
                  // Assumindo que o backend serve os uploads a partir da raiz
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
              {/* Opcional: Adicionar um rodapé com mais ações se necessário */}
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
