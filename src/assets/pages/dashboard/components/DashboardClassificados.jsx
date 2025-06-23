// src/assets/pages/dashboard/components/DashboardClassificados.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./DashboardWidgets.css"; // Reutiliza o mesmo CSS dos outros widgets

const DashboardClassificados = ({ classificados = [] }) => {
  return (
    <div className="dashboard-widget">
      <h3 className="widget-title">Novos Classificados</h3>
      <div className="widget-content">
        {classificados.length > 0 ? (
          classificados.map((anuncio) => (
            <div key={anuncio.id} className="widget-card classificado-card">
              <h4>{anuncio.titulo}</h4>
              <p>{anuncio.descricao.substring(0, 80)}...</p>
              <small>
                Publicado por:{" "}
                {anuncio.anunciante?.NomeCompleto || "Desconhecido"}
              </small>
            </div>
          ))
        ) : (
          <p>Nenhum anúncio novo.</p>
        )}
      </div>
      <div className="widget-footer">
        <Link to="/classificados" className="widget-link">
          Ver todos os classificados &rarr;
        </Link>
      </div>
    </div>
  );
};

export default DashboardClassificados;
