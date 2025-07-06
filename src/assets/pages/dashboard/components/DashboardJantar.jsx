import React from "react";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import { getProximosDaFila } from "../../../../services/escalaService";
import "./DashboardWidgets.css"; // Reutilizando os estilos existentes

const DashboardJantar = () => {
  const {
    data: proximos,
    isLoading,
    error,
  } = useDataFetching(getProximosDaFila);

  return (
    <div className="dashboard-widget">
      <h3 className="widget-title">Próximos na Escala do Jantar</h3>
      <div className="widget-content">
        {isLoading && <p>A carregar escala...</p>}
        {error && <p className="error-message">{error}</p>}
        {proximos && proximos.length > 0 ? (
          <ul className="jantar-fila-lista">
            {proximos.map((item) => (
              <li key={item.id} className="jantar-fila-item">
                <span className="ordem-item">{item.ordem + 1}º</span>
                <span className="nome-item">{item.membro.NomeCompleto}</span>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p>Não há membros na fila da escala.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardJantar;
