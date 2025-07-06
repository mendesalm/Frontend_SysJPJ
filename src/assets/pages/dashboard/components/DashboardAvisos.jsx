import React from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import "./DashboardWidgets.css";

const DashboardAvisos = ({ totalAvisos = 0 }) => {
  const navigate = useNavigate();

  const handleWidgetClick = () => {
    navigate("/mural-de-avisos");
  };

  return (
    <div
      className="dashboard-widget clickable"
      onClick={handleWidgetClick}
      role="button"
      tabIndex="0"
      onKeyPress={(e) =>
        (e.key === "Enter" || e.key === " ") && handleWidgetClick()
      }
    >
      <h3 className="widget-title">Mural de Avisos</h3>
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
            color: "var(--cor-texto-secundario)",
          }}
        >
          Total de Avisos Ativos
        </p>
        <p
          className="stat-value"
          style={{ fontSize: "3.5rem", color: "#ef4444" }}
        >
          {" "}
          {/* Cor vermelha aplicada aqui */}
          <CountUp start={0} end={totalAvisos} duration={2.5} separator="." />
        </p>
      </div>
    </div>
  );
};

export default DashboardAvisos;
