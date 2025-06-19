import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import { getSessionById } from "../../../../services/sessionService";
import PainelChanceler from "./components/PainelChanceler";
import BalaustreEditor from "./components/BalaustreEditor";
import ParticipantesTab from "./components/ParticipantesTab";
import VisitantesTab from "./components/VisitantesTab";
import "./SessaoDetalhes.css";

const SessaoDetalhesPage = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const balaustreId = location.state?.balaustreId;

  const {
    data: sessionData, // Alterado para sessionData para clareza
    isLoading: isLoadingSession,
    error,
  } = useDataFetching(getSessionById, [sessionId]);

  // Usamos useMemo para garantir que 'session' seja recalculado apenas quando os dados mudam.
  const session = useMemo(() => {
    // O hook useDataFetching, por padrão, retorna um array. Pegamos o primeiro item.
    if (sessionData && Array.isArray(sessionData) && sessionData.length > 0) {
      return sessionData[0];
    }
    // Se a API retornar um objeto único (não em um array), usamos diretamente.
    if (
      sessionData &&
      typeof sessionData === "object" &&
      !Array.isArray(sessionData)
    ) {
      return sessionData;
    }
    return null;
  }, [sessionData]);

  // DEBUG: Inspeciona o objeto 'session' final após ser processado.
  console.log(
    "[SessaoDetalhesPage] Conteúdo final do objeto 'session':",
    session
  );

  const [activeTab, setActiveTab] = useState("");

  const permissoes = useMemo(
    () => ({
      chanceler: ["Webmaster", "Diretoria", "Chanceler"].includes(
        user?.credencialAcesso
      ),
      balaustre: ["Webmaster", "Secretário", "Secretário Adjunto"].includes(
        user?.credencialAcesso
      ),
      presenca: ["Webmaster", "Chanceler", "Secretário"].includes(
        user?.credencialAcesso
      ),
      visitantes: ["Webmaster", "Chanceler", "Secretário"].includes(
        user?.credencialAcesso
      ),
    }),
    [user]
  );

  useEffect(() => {
    if (!session || activeTab) return;
    const abasDisponiveis = [
      "chanceler",
      "balaustre",
      "presentes",
      "visitantes",
    ];
    const primeiraAbaValida = abasDisponiveis.find((aba) => permissoes[aba]);
    if (primeiraAbaValida) {
      setActiveTab(primeiraAbaValida);
    }
  }, [session, activeTab, permissoes]);

  if (isLoadingSession) {
    return <div className="page-container">Carregando dados da sessão...</div>;
  }
  if (error) {
    return <div className="page-container error-message">{error}</div>;
  }
  if (!session) {
    return <div className="page-container">Sessão não encontrada.</div>;
  }

  return (
    <div className="page-container sessao-detalhes-container">
      <div className="table-header">
        <h1>
          {/* CORREÇÃO: Adicionada verificação para evitar 'Invalid Date' */}
          Gestão da Sessão de{" "}
          {session.dataSessao
            ? new Date(session.dataSessao).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })
            : "Data não informada"}
        </h1>
        <button
          onClick={() => navigate("/sessoes")}
          className="btn btn-secondary"
        >
          Voltar
        </button>
      </div>

      <div className="tabs">
        {permissoes.chanceler && (
          <button
            className={`tab-button ${
              activeTab === "chanceler" ? "active" : ""
            }`}
            onClick={() => setActiveTab("chanceler")}
          >
            Painel do Chanceler
          </button>
        )}
        {permissoes.balaustre && (
          <button
            className={`tab-button ${
              activeTab === "balaustre" ? "active" : ""
            }`}
            onClick={() => setActiveTab("balaustre")}
          >
            Balaústre
          </button>
        )}
        {permissoes.presenca && (
          <button
            className={`tab-button ${
              activeTab === "presentes" ? "active" : ""
            }`}
            onClick={() => setActiveTab("presentes")}
          >
            Presentes
          </button>
        )}
        {permissoes.visitantes && (
          <button
            className={`tab-button ${
              activeTab === "visitantes" ? "active" : ""
            }`}
            onClick={() => setActiveTab("visitantes")}
          >
            Visitantes
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === "chanceler" && <PainelChanceler sessionId={sessionId} />}
        {activeTab === "balaustre" && (
          <BalaustreEditor balaustreId={balaustreId} />
        )}
        {activeTab === "presentes" && (
          <ParticipantesTab sessionId={sessionId} />
        )}
        {activeTab === "visitantes" && <VisitantesTab sessionId={sessionId} />}
      </div>
    </div>
  );
};

export default SessaoDetalhesPage;
