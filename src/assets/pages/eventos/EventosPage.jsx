import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
  confirmarPresenca,
} from "../../../services/eventosService";
import Modal from "../../../components/modal/Modal";
// CORREÇÃO: A importação do formulário foi corrigida para usar o EventoForm.
import EventoForm from "./EventoForm";
import "./EventosPage.css";
import "../../styles/TableStyles.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

// O restante do arquivo permanece o mesmo...

const EventosPage = () => {
  const {
    data: eventos,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getEventos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvento, setCurrentEvento] = useState(null);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      const isUpdating = !!currentEvento;
      if (isUpdating) {
        await updateEvento(currentEvento.id, formData);
      } else {
        await createEvento(formData);
      }
      refetch();
      setIsModalOpen(false);
      showSuccessToast(
        `Evento ${isUpdating ? "atualizado" : "criado"} com sucesso!`
      );
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Ocorreu um erro ao salvar o evento."
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este evento?")) {
      try {
        await deleteEvento(id);
        refetch();
        showSuccessToast("Evento apagado com sucesso!");
      } catch (err) {
        showErrorToast("Não foi possível apagar o evento.");
        console.error(err);
      }
    }
  };

  const handleConfirmarPresenca = async (eventoId, status) => {
    try {
      await confirmarPresenca(eventoId, { statusConfirmacao: status });
      refetch();
      showSuccessToast(
        `Sua presença foi registrada como "${status}" com sucesso!`
      );
    } catch (err) {
      showErrorToast(
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

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="eventos-list">
        {isLoading ? (
          <p>A carregar eventos...</p>
        ) : eventos.length === 0 ? (
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
