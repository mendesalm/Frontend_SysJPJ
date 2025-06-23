import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../services/apiClient";
import "./SessionExpirationModal.css"; // Vamos criar este ficheiro de estilos

const SessionExpirationManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Configura o intercetor na resposta da API
    const interceptor = apiClient.interceptors.response.use(
      // Se a resposta for bem-sucedida, não faz nada
      (response) => response,

      // Se ocorrer um erro...
      (error) => {
        // Verifica se o erro é de "Não Autorizado" (sessão expirada/inválida)
        if (error.response && error.response.status === 401) {
          // Mostra o modal em vez de deslogar imediatamente
          setIsModalVisible(true);
        }
        // Propaga o erro para que outras partes da aplicação possam lidar com ele se necessário
        return Promise.reject(error);
      }
    );

    // Função de limpeza: remove o intercetor quando o componente for desmontado
    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [logout, navigate]); // As dependências garantem que a função tem acesso ao logout e navigate atualizados

  const handleRedirectToLogin = () => {
    logout(); // Limpa o estado de autenticação e o token
    setIsModalVisible(false); // Esconde o modal
    navigate("/login"); // Redireciona para a página de login
  };

  if (!isModalVisible) {
    return null; // Não renderiza nada se o modal não for necessário
  }

  return (
    <div className="session-modal-overlay">
      <div className="session-modal-content">
        <h2>Sessão Expirada</h2>
        <p>
          A sua sessão de login terminou por inatividade ou o seu acesso foi
          revogado. Para continuar e evitar a perda de dados, por favor, faça o
          login novamente.
        </p>
        <button onClick={handleRedirectToLogin} className="btn btn-primary">
          Fazer Login Novamente
        </button>
      </div>
    </div>
  );
};

export default SessionExpirationManager;
