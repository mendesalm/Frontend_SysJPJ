import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import { getSessionById } from "../../../../services/sessionService";
import { getAllMembers } from "../../../../services/memberService";
import { getCalendarioUnificado } from "../../../../services/dashboardService";
import LoadingOverlay from "../../../../components/layout/LoadingOverlay";
import ParticipantesTab from "./components/ParticipantesTab";
import VisitantesTab from "./components/VisitantesTab";
import JantarTab from "./components/JantarTab";
import BalaustreEditor from "./components/BalaustreEditor";
import PainelChanceler from "./components/PainelChanceler";
import "./SessaoDetalhes.css";
import moment from "moment";


const getFileUrl = (path) => {
  if (!path) return "#";
  // Ensure the path is absolute from the origin, without duplicating /uploads/
  return `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
};

const SessaoDetalhesPage = () => {
  const { id } = useParams();
  console.log("[SessaoDetalhesPage] Session ID from useParams:", id);
  const [activeTab, setActiveTab] = useState("chanceler");

  const fetchSession = useCallback(() => getSessionById(id), [id]);
  const {
    data: sessionData,
    isLoading: isLoadingSession,
    error: sessionError,
    refetch,
  } = useDataFetching(fetchSession);

  const { data: members, isLoading: isLoadingMembers } =
    useDataFetching(getAllMembers);

  const participantesTabRef = useRef(null);

  const handleSaveClick = () => {
    if (participantesTabRef.current) {
      participantesTabRef.current.handleSaveAttendance();
    }
  };

  const session = useMemo(() => {
    const s = sessionData
      ? Array.isArray(sessionData)
        ? sessionData[0]
        : sessionData
      : null;
    console.log("Session Data received:", s);
    console.log("Attendees in Session Data:", s?.attendees);
    console.log("Balaustre in Session Data:", s?.Balaustre);
    return s;
  }, [sessionData]);

  const [calendarioData, setCalendarioData] = useState([]);
  const [isLoadingCalendario, setIsLoadingCalendario] = useState(false);

  useEffect(() => {
    if (session && session.dataSessao) {
      const fetchCalendarData = async () => {
        setIsLoadingCalendario(true);
        try {
          const sessionDate = moment.utc(session.dataSessao).toDate();
          const ano = sessionDate.getFullYear();
          const mes = sessionDate.getMonth() + 1;
          const response = await getCalendarioUnificado(ano, mes);
          setCalendarioData(response.data);
        } catch (error) {
          console.error(
            "Erro ao buscar dados do calendário para o painel",
            error
          );
        } finally {
          setIsLoadingCalendario(false);
        }
      };
      fetchCalendarData();
    }
  }, [session]);

  const dadosChancelaria = useMemo(() => {
    if (!session || !members || !calendarioData) return null;

    const responsavel = members.find(
      (m) => m.id === session.responsavelJantarLodgeMemberId
    );
    const esposa = responsavel?.familiares?.find(
      (f) => f.parentesco === "Esposa" || f.parentesco === "Cônjuge"
    );

    const aniversariosDoMes = calendarioData.filter(
      (e) => e.tipo === "Aniversário"
    );
    const aniversariantesCivis = [];
    const aniversariosCasamento = [];
    const aniversariantesMaconicos = [];

    aniversariosDoMes.forEach((aniv) => {
      const lowerTitle = aniv.titulo.toLowerCase();
      const anosMatch = aniv.titulo.match(/\((\d+)\s*anos\)/);
      const anos = anosMatch ? anosMatch[1] : "";

      if (
        lowerTitle.includes("iniciação") ||
        lowerTitle.includes("elevação") ||
        lowerTitle.includes("exaltação")
      ) {
        aniversariantesMaconicos.push({
          ...aniv,
          nome: aniv.titulo.replace(/\s\(.*/, ""),
          anos,
        });
      } else if (lowerTitle.includes("casamento")) {
        aniversariosCasamento.push({
          ...aniv,
          nome: aniv.titulo.replace(/\s\(.*/, ""),
          anos,
        });
      } else {
        aniversariantesCivis.push({
          ...aniv,
          nome: aniv.titulo,
          tipo: "Civil",
        });
      }
    });

    return {
      jantar: { responsavel, esposa },
      aniversariantesCivis,
      aniversariosCasamento,
      aniversariantesMaconicos,
    };
  }, [session, members, calendarioData]);

  const isLoading = isLoadingSession || isLoadingMembers || isLoadingCalendario;

  if (isLoading) {
    return <LoadingOverlay>A carregar detalhes da sessão...</LoadingOverlay>;
  }

  if (sessionError) {
    return (
      <div className="error-message">
        Erro ao carregar sessão: {sessionError}
      </div>
    );
  }

  if (!session) {
    return <div className="error-message">Sessão não encontrada.</div>;
  }

  return (
    <div className="session-details-container">
      <div className="session-main-content">
        <div className="session-header">
          <h1>
            Sessão {session.tipoSessao} de {session.subtipoSessao}
          </h1>
          <p className="session-date">
            {moment.utc(session.dataSessao).format("DD [de] MMMM [de] YYYY")}
          </p>
          <div className="session-documents">
            {session.edital?.caminhoPdfLocal && (
              <div className="edital-display-section">
                <h4 className="mt-3">Edital</h4>
                <iframe
                  src={getFileUrl(session.edital.caminhoPdfLocal)}
                  title="Edital PDF"
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                ></iframe>
              </div>
            )}
            {session.balaustre?.caminhoPdfLocal && (
              <div className="balaustre-display-section">
                <h4 className="mt-3">Balaústre</h4>
                <p>Status: <strong>{session.balaustre.status}</strong></p>
                {session.balaustre.assinaturas && session.balaustre.assinaturas.length > 0 && (
                  <div>
                    <h5>Assinaturas:</h5>
                    <ul>
                      {session.balaustre.assinaturas.map((sig, index) => (
                        <li key={index}>{sig.signer} ({sig.role}) - {new Date(sig.timestamp).toLocaleString()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <iframe
                  src={getFileUrl(session.balaustre.caminhoPdfLocal)}
                  title="Balaústre PDF"
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                ></iframe>
              </div>
            )}
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "chanceler" ? "active" : ""}`}
            onClick={() => setActiveTab("chanceler")}
          >
            Painel do Chanceler
          </button>
          <button
            className={`tab-button ${
              activeTab === "participantes" ? "active" : ""
            }`}
            onClick={() => setActiveTab("participantes")}
          >
            Participantes ({session.presentes?.length || 0})
          </button>
          <button
            className={`tab-button ${activeTab === "visitantes" ? "active" : ""}`}
            onClick={() => setActiveTab("visitantes")}
          >
            Visitantes ({session.visitantes?.length || 0})
          </button>
          <button
            className={`tab-button ${activeTab === "jantar" ? "active" : ""}`}
            onClick={() => setActiveTab("jantar")}
          >
            Jantar
          </button>
          <button
            className={`tab-button ${activeTab === "balaustre" ? "active" : ""}`}
            onClick={() => setActiveTab("balaustre")}
          >
            Balaústre
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "chanceler" && (
            <PainelChanceler
              dadosChancelaria={dadosChancelaria}
              dataSessao={session.dataSessao}
            />
          )}
          {activeTab === "participantes" && (
            <ParticipantesTab
              ref={participantesTabRef}
              attendees={session.attendees || []}
              sessionId={id}
              refetchSession={refetch}
            />
          )}
          {activeTab === "visitantes" && (
            <VisitantesTab
              visitantes={session.visitantes || []}
              sessionId={id}
              refetchSession={refetch}
            />
          )}
          {activeTab === "jantar" && (
            <JantarTab
              sessionId={id}
              membros={members || []}
              responsavelId={session.responsavelJantarLodgeMemberId}
              esposaNome={session.conjugeResponsavelJantarNome}
              refetchSession={refetch}
            />
          )}
          {activeTab === "balaustre" && (
            <BalaustreEditor
              balaustreId={session.balaustre?.id}
              refetchSession={refetch}
            />
          )}
        </div>
      </div>
      {activeTab === "participantes" && (
        <div className="session-sidebar-right">
          <button onClick={handleSaveClick} className="btn btn-primary">
            Salvar Presença
          </button>
        </div>
      )}
    </div>
  );
};

export default SessaoDetalhesPage;
