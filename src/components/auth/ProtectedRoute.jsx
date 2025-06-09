import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importe o nosso hook

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto o AuthContext verifica se existe uma sessão válida,
  // exibimos uma mensagem de carregamento.
  if (loading) {
    return <div>A verificar autenticação...</div>;
  }

  // Se, após a verificação, o utilizador não estiver autenticado,
  // redireciona para a página de login.
  if (!isAuthenticated) {
    return <Navigate to="/login-teste" replace />;
  }

  // Se estiver autenticado, renderiza a rota filha (ex: Dashboard).
  return <Outlet />;
};

export default ProtectedRoute;