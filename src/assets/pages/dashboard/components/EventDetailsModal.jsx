import React from "react";
import "./EventDetailsModal.css"; // Ficheiro de estilos para o conteúdo do modal

const EventDetailsModal = ({ events }) => {
  if (!events || events.length === 0) {
    return <p>Nenhum evento agendado para esta data.</p>;
  }

  return (
    <div className="event-details-container">
      {events.map((event) => (
        <div
          key={event.id}
          className="event-detail-item"
          style={{ borderLeftColor: event.cor || "#10b981" }}
        >
          <h4 className="event-title">{event.titulo}</h4>
          <p className="event-time">
            {event.hora ? `Horário: ${event.hora}` : "Dia todo"}
          </p>
          {event.descricao && (
            <p className="event-description">{event.descricao}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventDetailsModal;
