
import React, { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../../../services/dashboardService";
import { getAllAvisos } from "../../../services/avisoService";
import { getSessions } from "../../../services/sessionService";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";
import NextSessionWidget from "./components/NextSessionWidget";
import NoticesWidget from "./components/NoticesWidget";
import EventCalendar from "./components/EventCalendar";
import DashboardClassificados from "./components/DashboardClassificados";
import DashboardJantar from "./components/DashboardJantar";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [avisos, setAvisos] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [nextSession, setNextSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [dashboardResponse, avisosResponse, sessionsResponse] = await Promise.all([
        getDashboardData(),
        getAllAvisos(),
        getSessions({ sortBy: 'dataSessao', order: 'ASC' }),
      ]);

      if (dashboardResponse && dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      } else {
        throw new Error("Resposta da API de dashboard inválida.");
      }

      if (avisosResponse && avisosResponse.data) {
        setAvisos(avisosResponse.data);
      } else {
        throw new Error("Resposta da API de avisos inválida.");
      }

      if (sessionsResponse && sessionsResponse.data) {
        setSessions(sessionsResponse.data);
        const now = new Date();
        const futureAgendadaSessions = sessionsResponse.data.filter(session => 
          new Date(session.dataSessao) >= now && session.status === 'Agendada'
        ).sort((a, b) => new Date(a.dataSessao) - new Date(b.dataSessao));
        setNextSession(futureAgendadaSessions[0] || null);
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

    const commonProps = {
      data: dashboardData,
      avisosCount: avisos.length,
    };

    switch (dashboardData.tipo) {
      case "admin":
        return <AdminDashboard {...commonProps} />;
      case "membro":
        return <MemberDashboard {...commonProps} />;
      default:
        return <p>Tipo de dashboard desconhecido.</p>;
    }
  };

  return (
    <div className="dashboard-container">
      {renderDashboardType()}
      <div className="dashboard-bottom-section">
        <div className="avisos-classificados-column">
          <div className="next-session-widget-container">
            <NextSessionWidget session={nextSession} />
          </div>
          <div className="classificados-widget-container">
            <DashboardClassificados
              totalClassificados={dashboardData?.totalClassificados}
            />
          </div>
          <div className="jantar-widget-container">
            <DashboardJantar />
          </div>
        </div>
        <div className="calendar-widget-container">
          <EventCalendar sessions={sessions} />
        </div>
      </div>
    </div>
  );
};


export default DashboardPage;
