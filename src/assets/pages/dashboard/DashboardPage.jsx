import React, { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../../../services/dashboardService";
import { getAllAvisos } from "../../../services/avisoService";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";
import DashboardAvisos from "./components/DashboardAvisos";
import EventCalendar from "./components/EventCalendar";
import DashboardClassificados from "./components/DashboardClassificados";
import DashboardJantar from "./components/DashboardJantar";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [totalAvisos, setTotalAvisos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [dashboardResponse, avisosResponse] = await Promise.all([
        getDashboardData(),
        getAllAvisos(),
      ]);

      if (dashboardResponse && dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      } else {
        throw new Error("Resposta da API de dashboard inválida.");
      }

      if (avisosResponse && avisosResponse.data) {
        setTotalAvisos(avisosResponse.data.length);
      } else {
        throw new Error("Resposta da API de avisos inválida.");
      }
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError("Não foi possível carregar os dados do painel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div className="dashboard-container">A carregar dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-container error-message">{error}</div>;
  }

  const renderDashboardType = () => {
    if (!dashboardData) return null;

    switch (dashboardData.tipo) {
      case "admin":
        return <AdminDashboard data={dashboardData} />;
      case "membro":
        return <MemberDashboard data={dashboardData} />;
      default:
        return <p>Tipo de dashboard desconhecido.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Secção superior com as estatísticas */}
      {renderDashboardType()}

      {/* Grelha inferior atualizada */}
      <div className="dashboard-bottom-section">
        <div className="avisos-classificados-column">
          <div className="avisos-widget-container">
            <DashboardAvisos totalAvisos={totalAvisos} />
          </div>
          <div className="classificados-widget-container">
            {/* A prop foi alterada para passar o número total */}
            <DashboardClassificados
              totalClassificados={dashboardData?.totalClassificados}
            />
          </div>
          <div className="jantar-widget-container">
            <DashboardJantar />
          </div>
        </div>
        <div className="calendar-widget-container">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
