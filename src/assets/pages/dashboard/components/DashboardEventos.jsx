import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getEventos } from "../../../../services/eventosService";
import "./DashboardWidgets.css"; // Reutiliza o mesmo CSS

const DashboardEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEventos = useCallback(async () => {
    try {
      const response = await getEventos();
      // Filtra para pegar apenas eventos futuros, ordena-os e pega os próximos 3
      const proximosEventos = response.data
        .filter((evento) => new Date(evento.dataHoraInicio) > new Date())
        .sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio))
        .slice(0, 3);
      setEventos(proximosEventos);
    } catch (error) {
      console.error("Erro ao buscar eventos para o dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  return (
    <div className="dashboard-widget">
      <h3 className="widget-title">Agenda de Eventos</h3>
      <div className="widget-content">
        {loading ? (
          <p>A carregar eventos...</p>
        ) : eventos.length > 0 ? (
          eventos.map((evento) => (
            <div key={evento.id} className="widget-card evento-card">
              <h4>{evento.titulo}</h4>
              <p>
                <strong>Quando:</strong>{" "}
                {new Date(evento.dataHoraInicio).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              <p>
                <strong>Onde:</strong> {evento.local}
              </p>
            </div>
          ))
        ) : (
          <p>Nenhum evento agendado.</p>
        )}
      </div>
      <div className="widget-footer">
        <Link to="/eventos" className="widget-link">
          Ver agenda completa &rarr;
        </Link>
      </div>
    </div>
  );
};

export default DashboardEventos;
