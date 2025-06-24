// src/assets/pages/dashboard/components/EventCalendar.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getCalendarioUnificado } from "../../../../services/dashboardService";
import Modal from "../../../../components/modal/Modal";
import "./EventCalendar.css";
import { showErrorToast } from "../../../../utils/notifications";

const localizer = momentLocalizer(moment);

// Função para converter o tipo de evento (ex: "Sessão") numa classe CSS válida (ex: "sessao")
const sanitizeEventType = (type) => {
  return type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Componente para renderizar o evento com um ponto colorido
const ColoredEvent = ({ event }) => (
  <div className="rbc-event-content-wrapper">
    <div className={`rbc-event-dot`}></div>
    <span>{event.title}</span>
  </div>
);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const fetchEvents = useCallback(async (currentDate) => {
    try {
      setLoading(true);
      const ano = currentDate.getFullYear();
      const mes = currentDate.getMonth() + 1;
      const response = await getCalendarioUnificado(ano, mes);

      const formattedEvents = response.data.map((item) => ({
        id: item.id,
        title: item.titulo,
        start: new Date(item.data),
        end: new Date(item.data),
        allDay: true,
        resource: {
          type: item.tipo || "geral",
          status: item.status,
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao buscar eventos para o calendário:", error);
      showErrorToast("Não foi possível carregar os dados do calendário.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(date);
  }, [date, fetchEvents]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  // Aplica uma classe CSS customizada com base no tipo de evento
  const eventPropGetter = useCallback((event) => {
    const className = `rbc-event-${sanitizeEventType(event.resource.type)}`;
    return {
      className,
    };
  }, []);

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

  return (
    <>
      <div className="event-calendar-container">
        {loading && (
          <div className="calendar-loading-overlay">
            A carregar calendário...
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 250px)" }}
          messages={messages}
          views={["month"]}
          onSelectEvent={handleSelectEvent}
          date={date}
          onNavigate={handleNavigate}
          eventPropGetter={eventPropGetter}
          components={{
            event: ColoredEvent,
          }}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <div className="event-details-modal">
            <p>
              <strong>Data:</strong>{" "}
              {moment(selectedEvent.start).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Tipo:</strong>{" "}
              <span
                className={`event-type-badge event-type-${sanitizeEventType(
                  selectedEvent.resource.type
                )}`}
              >
                {selectedEvent.resource.type}
              </span>
            </p>
            {selectedEvent.resource.status && (
              <p>
                <strong>Status:</strong> {selectedEvent.resource.status}
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default EventCalendar;
