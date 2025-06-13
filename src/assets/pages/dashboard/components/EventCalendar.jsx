import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getEventos,
  confirmarPresenca,
} from "../../../../services/eventosService";
import Modal from "../../../../components/modal/Modal";
import "./EventCalendar.css";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acompanhantes, setAcompanhantes] = useState(0);

  // Estados para controlar a navegação do calendário
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEventos();
      const formattedEvents = response.data.map((evento) => ({
        id: evento.id,
        title: evento.titulo,
        start: new Date(evento.dataHoraInicio),
        end: evento.dataHoraFim
          ? new Date(evento.dataHoraFim)
          : new Date(evento.dataHoraInicio),
        allDay: false,
        resource: evento, // Guarda o objeto original com todos os dados
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao buscar eventos para o calendário:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Função para lidar com o clique num evento do calendário
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setAcompanhantes(0); // Reseta o contador de acompanhantes ao abrir o modal
    setIsModalOpen(true);
  };

  const handleConfirmarPresenca = async (eventoId, status) => {
    try {
      await confirmarPresenca(eventoId, {
        statusConfirmacao: status,
        // Envia o número de acompanhantes, ou 0 se a presença for recusada
        acompanhantes: status === "Confirmado" ? acompanhantes : 0,
      });
      setIsModalOpen(false);
      fetchEvents(); // Recarrega os eventos para atualizar a lista de participantes
    } catch (error) {
      console.error("Erro ao confirmar presença:", error);
      // Poderia adicionar um feedback de erro aqui
    }
  };

  // Handlers para controlar a navegação e a mudança de vista do calendário
  const handleNavigate = useCallback((newDate) => setDate(newDate), [setDate]);
  const handleView = useCallback((newView) => setView(newView), [setView]);

  const messages = {
    allDay: "Dia todo",
    previous: "Anterior",
    next: "Próximo",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Não há eventos neste período.",
    showMore: (total) => `+ Ver mais (${total})`,
  };

  if (loading) {
    return (
      <div className="event-calendar-container">A carregar calendário...</div>
    );
  }

  // Calcula o total de confirmados para exibir no modal
  const totalConfirmados =
    selectedEvent?.participantes?.reduce((acc, p) => {
      // Acessa o número de acompanhantes através da tabela de junção
      const numAcompanhantes = p.confirmacao?.acompanhantes || 0;
      return acc + 1 + numAcompanhantes;
    }, 0) || 0;

  return (
    <>
      <div className="event-calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 250px)" }}
          messages={messages}
          views={["month", "week", "day"]}
          onSelectEvent={handleSelectEvent}
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleView}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent?.titulo}
      >
        {selectedEvent && (
          <div className="event-details-modal">
            <p>
              <strong>Quando:</strong>{" "}
              {new Date(selectedEvent.dataHoraInicio).toLocaleString("pt-BR")}
            </p>
            <p>
              <strong>Onde:</strong> {selectedEvent.local}
            </p>
            <p className="event-description">{selectedEvent.descricao}</p>

            {selectedEvent.participantes &&
              selectedEvent.participantes.length > 0 && (
                <div className="participants-section">
                  <strong>Presenças Confirmadas ({totalConfirmados}):</strong>
                  <div className="participants-list">
                    {selectedEvent.participantes.map((p) => (
                      <span key={p.id} className="participant-tag">
                        {p.NomeCompleto}
                        {p.confirmacao?.acompanhantes > 0 &&
                          ` (+${p.confirmacao.acompanhantes})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="presenca-actions">
              <p>Sua presença:</p>
              <div className="acompanhantes-input">
                <label htmlFor="acompanhantes">Acompanhantes:</label>
                <input
                  type="number"
                  id="acompanhantes"
                  value={acompanhantes}
                  onChange={(e) =>
                    setAcompanhantes(parseInt(e.target.value, 10) || 0)
                  }
                  min="0"
                />
              </div>
              <button
                onClick={() =>
                  handleConfirmarPresenca(selectedEvent.id, "Confirmado")
                }
                className="btn-action btn-approve"
              >
                Confirmar
              </button>
              <button
                onClick={() =>
                  handleConfirmarPresenca(selectedEvent.id, "Recusado")
                }
                className="btn-action btn-delete"
              >
                Recusar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default EventCalendar;
