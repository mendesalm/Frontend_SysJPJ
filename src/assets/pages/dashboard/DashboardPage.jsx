import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getDashboardData } from "../../../services/dashboardService";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";
import DashboardAvisos from "./components/DashboardAvisos";
import DashboardEventos from "./components/DashboardEventos";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { user } = useAuth();
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

  // Renderiza o painel apropriado com base no 'tipo' retornado pela API
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

      {/* Nova secção para Avisos e Eventos */}
      <div className="dashboard-widgets-section">
        <DashboardAvisos />
        <DashboardEventos />
      </div>
    </div>
  );
};

export default DashboardPage;
