import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getCalendarioUnificado } from "../../../../services/dashboardService";
import Modal from "../../../../components/modal/Modal";
import "./EventCalendar.css";
import { showErrorToast } from "../../../../utils/notifications";
import { SITUACAO_MEMBRO } from "../../../../constants/userConstants";

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

// Componente de detalhes do Modal, agora com lógica de agrupamento
const EventDetailsModalContent = ({ events }) => {
  const groupedEvents = useMemo(() => {
    if (!events || events.length === 0) return {};

    return events.reduce((acc, event) => {
      let groupKey = event.resource.type;
      if (groupKey === "Aniversário") {
        groupKey = `Aniversário de ${event.resource.subtipo}`;
      }
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(event);
      return acc;
    }, {});
  }, [events]);

  const groupTitles = {
    Sessão: "Sessões Agendadas",
    Evento: "Eventos Especiais",
    Locacao: "Locações do Salão",
    "Aniversário de membro": "Aniversários de Membros",
    "Aniversário de familiar": "Aniversários de Familiares",
    "Aniversário de maconico": "Datas Maçónicas",
  };

  if (Object.keys(groupedEvents).length === 0) {
    return <p>Nenhum evento para esta data.</p>;
  }

  return (
    <div className="event-details-modal-list">
      {Object.entries(groupedEvents).map(([groupKey, groupEvents]) => (
        <div key={groupKey} className="event-group">
          <h4 className="event-group-title">
            {groupTitles[groupKey] || groupKey} ({groupEvents.length})
          </h4>
          <ul className="event-group-list">
            {groupEvents.map((event, index) => (
              <li key={`${event.id}-${index}`}>{event.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const EventCalendar = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({ date: null, events: [] });

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
        .map((item) => ({
          id: item.id || item.data,
          title: item.titulo,
          start: parse(item.data.split("T")[0], "yyyy-MM-dd", new Date()),
          end: parse(item.data.split("T")[0], "yyyy-MM-dd", new Date()),
          allDay: true,
          resource: {
            type: item.tipo || "geral",
            subtipo:
              item.tipo === "Aniversário"
                ? getAniversarioSubtipo(item.titulo)
                : null,
            status: item.status,
            situacao: item.situacao || "Ativo", // Garante um valor padrão para filtragem
          },
        }));
      setAllEvents(formattedEvents);
    } catch (fetchError) {
      const errorMessage = "Não foi possível carregar os dados do calendário.";
      console.error("Erro ao buscar eventos para o calendário:", fetchError);
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
      if (event.resource.type !== "Aniversário") return true;
      if (event.resource.subtipo === "familiar") return true; // Mostra sempre os familiares por agora
      return filters[event.resource.situacao];
    });
  }, [allEvents, filters]);

  const openModalForDate = useCallback(
    (date) => {
      const eventsForDay = filteredEvents.filter((event) =>
        isSameDay(event.start, date)
      );
      if (eventsForDay.length > 0) {
        setSelectedSlot({ date, events: eventsForDay });
        setIsModalOpen(true);
      }
    },
    [filteredEvents]
  );

  const eventPropGetter = useCallback((event) => {
    let className = `rbc-event-${sanitizeEventType(event.resource.type)}`;
    if (event.resource.type === "Aniversário" && event.resource.subtipo) {
      className += `-${event.resource.subtipo}`;
    }
    return { className };
  }, []);

  const tileContent = ({ date }) => {
    const dayEvents = filteredEvents.filter((event) =>
      isSameDay(event.start, date)
    );

    if (dayEvents.length > 0) {
      // CORREÇÃO: Ordem de prioridade ajustada.
      const priorityMap = {
        Sessão: 1,
        membro: 2, // Aniversário de membro é prioridade 2
        familiar: 3, // Aniversário de familiar é prioridade 3
        maconico: 4, // Data maçónica é prioridade 4
        Evento: 5,
        Locacao: 6,
        geral: 99,
      };

      const getPriority = (event) => {
        if (event.resource.type === "Aniversário") {
          return priorityMap[event.resource.subtipo] || priorityMap.geral;
        }
        return priorityMap[event.resource.type] || priorityMap.geral;
      };

      const sortedEvents = [...dayEvents].sort(
        (a, b) => getPriority(a) - getPriority(b)
      );

      return (
        <div className="event-markers-container">
          {sortedEvents.slice(0, 3).map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className={`event-marker ${eventPropGetter(event).className}`}
            ></div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomDateHeader = ({ label, date }) => (
    <div className="custom-date-header" onClick={() => openModalForDate(date)}>
      {label}
    </div>
  );

  const handleFilterChange = (situacao) => {
    setFilters((prev) => ({ ...prev, [situacao]: !prev[situacao] }));
  };

  const handleSelectEvent = (event) => {
    openModalForDate(event.start);
  };

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      openModalForDate(slotInfo.start);
    },
    [openModalForDate]
  );

  const handleNavigate = (newDate) => {
    setDate(newDate);
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
            style={{ height: "100%" }}
            views={["month"]}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            date={date}
            onNavigate={handleNavigate}
            eventPropGetter={eventPropGetter}
            components={{
              event: ColoredEvent,
              month: { dateHeader: CustomDateHeader },
              tileContent: tileContent,
            }}
            culture="pt-BR"
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedSlot.date
            ? `Eventos para ${format(selectedSlot.date, "dd/MM/yyyy")}`
            : "Detalhes do Evento"
        }
      >
        <EventDetailsModalContent events={selectedSlot.events} />
      </Modal>
    </>
  );
};

export default EventCalendar;
