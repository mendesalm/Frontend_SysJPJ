import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllAvisos } from "../../../../services/avisoService";
import "./DashboardWidgets.css"; // Um CSS partilhado para os widgets

const DashboardAvisos = () => {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAvisos = useCallback(async () => {
    try {
      const response = await getAllAvisos();
      // Pega os 3 avisos mais recentes
      setAvisos(response.data.slice(0, 3));
    } catch (error) {
      console.error("Erro ao buscar avisos para o dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvisos();
  }, [fetchAvisos]);

  return (
    <div className="dashboard-widget">
      <h3 className="widget-title">Mural de Avisos</h3>
      <div className="widget-content">
        {loading ? (
          <p>A carregar avisos...</p>
        ) : avisos.length > 0 ? (
          avisos.map((aviso) => (
            <div key={aviso.id} className="widget-card aviso-card">
              <h4>{aviso.titulo}</h4>
              <p>{aviso.conteudo.substring(0, 100)}...</p>
              <small>
                Publicado em: {new Date(aviso.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>Nenhum aviso recente.</p>
        )}
      </div>
      <div className="widget-footer">
        <Link to="/mural-de-avisos" className="widget-link">
          Ver todos os avisos &rarr;
        </Link>
      </div>
    </div>
  );
};

export default DashboardAvisos;
