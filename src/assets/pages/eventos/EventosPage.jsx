import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o nosso hook
import {
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
  confirmarPresenca,
} from "../../../services/eventosService";
import Modal from "../../../components/modal/Modal";
import EventoForm from "./EventoForm";
import "./EventosPage.css";
import "../../styles/TableStyles.css";

const EventosPage = () => {
  // 2. A lógica de state e fetching é substituída por esta única linha
  const {
    data: eventos,
    isLoading,
    error: fetchError, // Renomeado para não colidir com o erro de ações
    refetch,
  } = useDataFetching(getEventos);

  const [actionError, setActionError] = useState(""); // Erro para ações como salvar/apagar
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvento, setCurrentEvento] = useState(null);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      setActionError("");
      if (currentEvento) {
        await updateEvento(currentEvento.id, formData);
      } else {
        await createEvento(formData);
      }
      refetch(); // 3. Usa a função `refetch` do hook para atualizar a lista
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
      setActionError(
        err.response?.data?.message || "Ocorreu um erro ao salvar o evento."
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este evento?")) {
      try {
        setActionError("");
        await deleteEvento(id);
        refetch(); // 3. Usa a função `refetch` do hook para atualizar a lista
      } catch (err) {
        console.error("Erro ao apagar evento:", err);
        setActionError("Não foi possível apagar o evento.");
      }
    }
  };

  const handleConfirmarPresenca = async (eventoId, status) => {
    try {
      setActionError("");
      setSuccessMessage("");
      await confirmarPresenca(eventoId, { statusConfirmacao: status });
      setSuccessMessage(
        `Sua presença foi registrada como "${status}" com sucesso!`
      );
      refetch(); // 3. Usa a função `refetch` do hook para atualizar a lista
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Erro ao confirmar presença:", err);
      setActionError(
        err.response?.data?.message ||
          "Não foi possível registar a sua presença."
      );
    }
  };

  const openModalToCreate = () => {
    setCurrentEvento(null);
    setIsModalOpen(true);
  };
  const openModalToEdit = (evento) => {
    setCurrentEvento(evento);
    setIsModalOpen(true);
  };

  if (isLoading)
    return <div className="table-page-container">A carregar...</div>;

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Agenda de Eventos</h1>
        {canManage && (
          <button
            onClick={openModalToCreate}
            className="btn-action btn-approve"
          >
            + Criar Evento
          </button>
        )}
      </div>

      {/* Exibe o erro de carregamento inicial ou o erro de uma ação de API */}
      {(fetchError || actionError) && (
        <p className="error-message" onClick={() => setActionError("")}>
          {fetchError || actionError}
        </p>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="eventos-list">
        {/* 4. Adicionada uma verificação para estado vazio */}
        {!isLoading && eventos.length === 0 ? (
          <p>Nenhum evento agendado no momento.</p>
        ) : (
          eventos.map((evento) => (
            <div key={evento.id} className="evento-card">
              <div className="evento-card-header">
                <h3>{evento.titulo}</h3>
                {canManage && (
                  <div className="evento-actions">
                    <button
                      onClick={() => openModalToEdit(evento)}
                      className="btn-action btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(evento.id)}
                      className="btn-action btn-delete"
                    >
                      Apagar
                    </button>
                  </div>
                )}
              </div>
              <div className="evento-card-body">
                <p>{evento.descricao}</p>
                {evento.participantes && evento.participantes.length > 0 && (
                  <div className="participants-section">
                    <strong>Presenças Confirmadas:</strong>
                    <div className="participants-list">
                      {evento.participantes.map((p) => (
                        <span key={p.id} className="participant-tag">
                          {p.NomeCompleto}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="evento-card-footer">
                <span>
                  <strong>Quando:</strong>{" "}
                  {new Date(evento.dataHoraInicio).toLocaleString("pt-BR")}
                </span>
                <span>
                  <strong>Onde:</strong> {evento.local}
                </span>
                <span
                  className={`evento-badge tipo-${evento.tipo
                    ?.toLowerCase()
                    .replace(/\s/g, "-")}`}
                >
                  {evento.tipo}
                </span>
              </div>
              <div className="presenca-actions">
                <p>Sua presença:</p>
                <button
                  onClick={() =>
                    handleConfirmarPresenca(evento.id, "Confirmado")
                  }
                  className="btn-action btn-approve"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => handleConfirmarPresenca(evento.id, "Recusado")}
                  className="btn-action btn-delete"
                >
                  Recusar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEvento ? "Editar Evento" : "Criar Novo Evento"}
      >
        <EventoForm
          eventoToEdit={currentEvento}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default EventosPage;
