import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Importa o hook useNavigate
import CountUp from "react-countup";
import "./DashboardWidgets.css";

const DashboardClassificados = ({ totalClassificados = 0 }) => {
  const navigate = useNavigate(); // 2. Inicializa o hook

  // 3. Função que será chamada ao clicar no widget
  const handleWidgetClick = () => {
    navigate("/classificados");
  };

  return (
    // 4. O div principal agora tem o evento onClick e uma classe para estilização
    <div
      className="dashboard-widget clickable"
      onClick={handleWidgetClick}
      role="button" // Melhora a acessibilidade
      tabIndex="0" // Permite que o elemento seja focado com o teclado
      onKeyPress={(e) =>
        (e.key === "Enter" || e.key === " ") && handleWidgetClick()
      } // Permite ativação com o teclado
    >
      <h3 className="widget-title">Classificados</h3>
      <div
        className="widget-content"
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "var(--font-size-lg)",
            color: "var(--text-color-secondary)",
          }}
        >
          Total de Anúncios Publicados
        </p>
        <p
          className="stat-value"
          style={{ fontSize: "3.5rem", color: "var(--success-color)" }}
        >
          <CountUp
            start={0}
            end={totalClassificados}
            duration={2.5}
            separator="."
          />
        </p>
      </div>
      {/* 5. O rodapé e o botão foram removidos */}
    </div>
  );
};

export default DashboardClassificados;
