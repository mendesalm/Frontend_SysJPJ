import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import { getSessionById } from "../../../../services/sessionService";
import PainelChanceler from "./components/PainelChanceler";
import BalaustreEditor from "./components/BalaustreEditor";
import ParticipantesTab from "./components/ParticipantesTab";
import VisitantesTab from "./components/VisitantesTab";
import JantarTab from "./components/JantarTab";

import "./SessaoDetalhes.css";

const SessaoDetalhesPage = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const balaustreId = location.state?.balaustreId;
  const [activeTab, setActiveTab] = useState("");

  // CORREÇÃO: Renomeado para 'sessionData' para indicar que é a resposta do hook
  const {
    data: sessionData,
    isLoading,
    error,
  } = useDataFetching(getSessionById, [sessionId]);

  // CORREÇÃO: Extrai o objeto da sessão do array retornado pelo hook.
  // useMemo garante que isso só seja recalculado quando os dados mudarem.
  const session = useMemo(() => {
    if (sessionData && Array.isArray(sessionData) && sessionData.length > 0) {
      return sessionData[0];
    }
    // Fallback para caso a API retorne um objeto único (mais robusto)
    if (
      sessionData &&
      typeof sessionData === "object" &&
      !Array.isArray(sessionData)
    ) {
      return sessionData;
    }
    return null;
  }, [sessionData]);

  const permissoes = useMemo(() => {
    const isAdmin = ["Webmaster", "Diretoria"].includes(user?.credencialAcesso);
    return {
      chanceler:
        isAdmin || user?.permissoes?.includes("visualizarPainelChanceler"),
      balaustre: isAdmin || user?.permissoes?.includes("editarBalaustre"),
      presenca:
        isAdmin || user?.permissoes?.includes("gerenciarPresentesSessao"),
      visitantes:
        isAdmin || user?.permissoes?.includes("gerenciarVisitantesSessao"),
      jantar: isAdmin || user?.permissoes?.includes("gerenciarEscalaJantar"),
    };
  }, [user]);

  useEffect(() => {
    if (!session || activeTab) return;

    const abasDisponiveis = [
      "chanceler",
      "balaustre",
      "presentes",
      "visitantes",
      "jantar",
    ];
    const primeiraAbaValida = abasDisponiveis.find((aba) => permissoes[aba]);

    if (primeiraAbaValida) {
      setActiveTab(primeiraAbaValida);
    }
  }, [session, activeTab, permissoes]);

  if (isLoading)
    return <div className="page-container">Carregando dados da sessão...</div>;
  if (error) return <div className="page-container error-message">{error}</div>;
  if (!session)
    return <div className="page-container">Sessão não encontrada.</div>;

  return (
    <div className="page-container sessao-detalhes-container">
      <div className="table-header">
        <h1>
          {/* Agora 'session.dataSessao' terá o valor correto, evitando 'Invalid Date' */}
          Gestão da Sessão de{" "}
          {new Date(session.dataSessao).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
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
        {permissoes.jantar && (
          <button
            className={`tab-button ${activeTab === "jantar" ? "active" : ""}`}
            onClick={() => setActiveTab("jantar")}
          >
            Jantar
          </button>
        )}
      </div>

      <div className="tab-content">
        {/* Renderiza o conteúdo da aba ativa */}
        {activeTab === "chanceler" && <PainelChanceler sessionId={sessionId} />}
        {activeTab === "balaustre" && (
          <BalaustreEditor balaustreId={balaustreId} />
        )}
        {activeTab === "presentes" && (
          <ParticipantesTab sessionId={sessionId} />
        )}
        {activeTab === "visitantes" && <VisitantesTab sessionId={sessionId} />}
        {activeTab === "jantar" && <JantarTab sessionId={sessionId} />}
      </div>
    </div>
  );
};

export default SessaoDetalhesPage;
