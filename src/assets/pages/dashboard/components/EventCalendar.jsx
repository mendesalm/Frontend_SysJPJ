// src/assets/pages/dashboard/components/EventCalendar.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getCalendarioUnificado } from "../../../../services/dashboardService";
import { getEventoById } from "../../../../services/eventosService";
import { getSessionById } from "../../../../services/sessionService";
import Modal from "../../../../components/modal/Modal";
import "./EventCalendar.css";
import { showErrorToast } from "../../../../utils/notifications";
import { FaBirthdayCake } from "react-icons/fa";
import { SITUACAO_MEMBRO } from "../../../../constants/userConstants";

const localizer = momentLocalizer(moment);

const SITUACOES_FILTRO = SITUACAO_MEMBRO.filter(
  (s) => s !== "Inativo" && s !== "Irregular"
);

const sanitizeEventType = (type) => {
  if (!type) return "geral";
  return type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getAniversarioSubtipo = (title) => {
  const lowerTitle = title.toLowerCase();
  if (
    lowerTitle.includes("iniciação") ||
    lowerTitle.includes("elevação") ||
    lowerTitle.includes("exaltação")
  ) {
    return "maconico";
  }
  if (
    lowerTitle.includes("esposa") ||
    lowerTitle.includes("filho") ||
    lowerTitle.includes("filha")
  ) {
    return "familiar";
  }
  return "membro";
};

const ColoredEvent = ({ event }) => (
  <div className="rbc-event-content-wrapper">
    <div className={`rbc-event-dot`}></div>
    <span>{event.title}</span>
  </div>
);

const EventCalendar = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    SITUACOES_FILTRO.forEach((situacao) => {
      initialFilters[situacao] = true;
    });
    return initialFilters;
  });

  const fetchEvents = useCallback(async (currentDate) => {
    try {
      setError(null);
      setLoading(true);
      const ano = currentDate.getFullYear();
      const mes = currentDate.getMonth() + 1;
      const response = await getCalendarioUnificado(ano, mes);

      const formattedEvents = response.data
        .filter((item) => item.data)
        .map((item) => {
          // CORREÇÃO: Trata a data como local para evitar problemas de fuso horário.
          const dateString = item.data.split("T")[0];
          const localDate = moment(dateString, "YYYY-MM-DD").toDate();

          return {
            id: item.id || item.data,
            title: item.titulo,
            start: localDate,
            end: localDate,
            allDay: item.tipo === "Aniversário",
            resource: {
              type: item.tipo || "geral",
              subtipo:
                item.tipo === "Aniversário"
                  ? getAniversarioSubtipo(item.titulo)
                  : null,
              status: item.status,
              situacao: item.situacao || "N/A",
              eventoId: item.tipo === "Evento" ? item.id : null,
              sessaoId: item.tipo === "Sessão" ? item.id : null,
            },
          };
        });
      setAllEvents(formattedEvents);
    } catch (err) {
      const errorMessage = "Não foi possível carregar os dados do calendário.";
      console.error("Erro ao buscar eventos para o calendário:", err);
      showErrorToast(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(date);
  }, [date, fetchEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      if (event.resource.type !== "Aniversário") {
        return true;
      }

      const situacao = event.resource.situacao;
      if (situacao === "N/A") {
        return filters["Ativo"];
      }

      return filters[situacao];
    });
  }, [allEvents, filters]);

  const handleFilterChange = (situacao) => {
    setFilters((prev) => ({ ...prev, [situacao]: !prev[situacao] }));
  };

  const handleSelectEvent = async (event) => {
    let details = { ...event };
    if (event.resource.type !== "Aniversário") {
      try {
        if (event.resource.eventoId) {
          const numericId = event.resource.eventoId.toString().split("-")[1];
          const res = await getEventoById(numericId);
          details = { ...details, ...res.data };
        } else if (event.resource.sessaoId) {
          const numericId = event.resource.sessaoId.toString().split("-")[1];
          const res = await getSessionById(numericId);
          details = { ...details, ...res.data[0] };
        }
      } catch (error) {
        showErrorToast(
          error.response?.data?.message ||
            "Não foi possível carregar os detalhes deste evento."
        );
      }
    }
    setSelectedEvent(details);
    setIsModalOpen(true);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const eventPropGetter = useCallback((event) => {
    let className = `rbc-event-${sanitizeEventType(event.resource.type)}`;
    if (event.resource.type === "Aniversário" && event.resource.subtipo) {
      className += `-${event.resource.subtipo}`;
    }
    return { className };
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
        <div className="calendar-filters-container">
          <span className="filter-title">Mostrar Aniversários:</span>
          <div className="filter-options">
            {SITUACOES_FILTRO.map((situacao) => (
              <div key={situacao} className="filter-checkbox">
                <input
                  type="checkbox"
                  id={`filter-${situacao}`}
                  checked={filters[situacao] || false}
                  onChange={() => handleFilterChange(situacao)}
                />
                <label htmlFor={`filter-${situacao}`}>{situacao}</label>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div className="calendar-loading-overlay">
            A carregar calendário...
          </div>
        )}

        {error && !loading && (
          <div className="calendar-error-message">{error}</div>
        )}

        {!loading && !error && (
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 300px)" }}
            messages={messages}
            views={["month"]}
            onSelectEvent={handleSelectEvent}
            date={date}
            onNavigate={handleNavigate}
            eventPropGetter={eventPropGetter}
            components={{ event: ColoredEvent }}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedEvent?.resource?.type === "Aniversário" ? (
            <>
              <FaBirthdayCake style={{ marginRight: "10px" }} />
              {selectedEvent?.title}
            </>
          ) : (
            selectedEvent?.title
          )
        }
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
                )}${
                  selectedEvent.resource.subtipo
                    ? `-${selectedEvent.resource.subtipo}`
                    : ""
                }`}
              >
                {selectedEvent.resource.type}
              </span>
            </p>
            {selectedEvent.status && (
              <p>
                <strong>Status:</strong> {selectedEvent.resource.status}
              </p>
            )}
            {selectedEvent.local && (
              <p>
                <strong>Local:</strong> {selectedEvent.local}
              </p>
            )}
            {selectedEvent.descricao && (
              <div className="event-description">
                <p>{selectedEvent.descricao}</p>
              </div>
            )}
            {selectedEvent.participantes &&
              selectedEvent.participantes.length > 0 && (
                <div className="participants-section">
                  <strong>
                    Presenças Confirmadas ({selectedEvent.participantes.length}
                    ):
                  </strong>
                  <div className="participants-list">
                    {selectedEvent.participantes.map((p) => (
                      <span key={p.id} className="participant-tag">
                        {p.NomeCompleto}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default EventCalendar;
