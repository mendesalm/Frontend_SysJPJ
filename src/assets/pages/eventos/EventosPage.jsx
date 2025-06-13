import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
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
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvento, setCurrentEvento] = useState(null);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const fetchEventos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getEventos();
      setEventos(
        response.data.sort(
          (a, b) => new Date(b.dataHoraInicio) - new Date(a.dataHoraInicio)
        )
      );
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
      setError("Falha ao carregar a agenda de eventos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const handleSave = async (formData) => {
    try {
      if (currentEvento) {
        await updateEvento(currentEvento.id, formData);
      } else {
        await createEvento(formData);
      }
      fetchEventos();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
      setError(
        err.response?.data?.message || "Ocorreu um erro ao salvar o evento."
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este evento?")) {
      try {
        await deleteEvento(id);
        fetchEventos();
      } catch (err) {
        console.error("Erro ao apagar evento:", err);
        setError("Não foi possível apagar o evento.");
      }
    }
  };

  const handleConfirmarPresenca = async (eventoId, status) => {
    try {
      setError("");
      setSuccessMessage("");
      await confirmarPresenca(eventoId, { statusConfirmacao: status });
      setSuccessMessage(
        `Sua presença foi registrada como "${status}" com sucesso!`
      );
      fetchEventos(); // Recarrega os eventos para mostrar a nova lista de presença
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Erro ao confirmar presença:", err);
      setError(
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
      {error && (
        <p className="error-message" onClick={() => setError("")}>
          {error}
        </p>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="eventos-list">
        {eventos.map((evento) => (
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

              {/* --- NOVA SECÇÃO: LISTA DE PARTICIPANTES --- */}
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
                onClick={() => handleConfirmarPresenca(evento.id, "Confirmado")}
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
        ))}
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
