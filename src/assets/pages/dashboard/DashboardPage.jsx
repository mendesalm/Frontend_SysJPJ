import React, { useState, useEffect, useCallback } from "react";
// CORREÇÃO: A importação de 'useAuth' foi removida pois não era utilizada.
import { getDashboardData } from "../../../services/dashboardService";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";
import DashboardAvisos from "./components/DashboardAvisos";
import EventCalendar from "./components/EventCalendar";
import "./DashboardPage.css";

const DashboardPage = () => {
  // CORREÇÃO: A chamada ao hook `useAuth` e a variável 'user' foram removidas.
  // A autenticação é garantida pelo ProtectedRoute e a API usa o token do localStorage.
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error("Resposta da API de dashboard inválida.");
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

      {/* Nova secção em grelha para Avisos e Calendário */}
      <div className="dashboard-bottom-section">
        <div className="avisos-widget-container">
          <DashboardAvisos />
        </div>
        <div className="calendar-widget-container">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
