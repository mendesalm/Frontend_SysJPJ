import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getDashboardData } from '../../../services/dashboardService';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from './MemberDashboard';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError('Não foi possível carregar os dados do painel.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="dashboard-container"><p>A carregar painel...</p></div>;
  }

  if (error) {
    return <div className="dashboard-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Painel de Controle</h2>
      <p className="dashboard-welcome-message">
        Bem-vindo(a) de volta, <strong>{user?.NomeCompleto || 'Membro'}</strong>!
      </p>

      {dashboardData?.tipo === 'admin' && <AdminDashboard data={dashboardData} />}
      {dashboardData?.tipo === 'membro' && <MemberDashboard data={dashboardData} />}
      
    </div>
  );
}

export default DashboardPage;
