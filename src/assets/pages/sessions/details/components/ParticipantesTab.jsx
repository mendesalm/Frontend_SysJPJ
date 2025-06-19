import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../../../../services/apiClient";
import { getAllMembers } from "../../../../../services/memberService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications";

const ParticipantesTab = ({ sessionId }) => {
  const [allMembers, setAllMembers] = useState([]);
  const [presentIds, setPresentIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log(
        `[ParticipantesTab] Buscando dados para sessão ID: ${sessionId}`
      );
      setIsLoading(true);
      try {
        const [membersRes, attendeesRes] = await Promise.all([
          getAllMembers({ limit: 1000 }),
          apiClient.get(`/sessions/${sessionId}/attendees`),
        ]);

        console.log(
          "[ParticipantesTab] Resposta de /attendees recebida:",
          attendeesRes.data
        );

        // CORREÇÃO: Trata a resposta da API de forma mais flexível.
        // Se a resposta for um objeto com a chave 'presentMemberIds', usa ela.
        // Se for diretamente um array, usa o array.
        const anttendeesData = attendeesRes.data;
        const ids = anttendeesData?.presentMemberIds || anttendeesData || [];

        setAllMembers(membersRes.data || []);
        setPresentIds(new Set(ids));
      } catch (error) {
        console.error("[ParticipantesTab] Erro ao buscar dados:", error);
        showErrorToast("Não foi possível carregar os dados de presença.");
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId]);

  const handleTogglePresence = (memberId) => {
    const newPresentIds = new Set(presentIds);
    if (newPresentIds.has(memberId)) {
      newPresentIds.delete(memberId);
    } else {
      newPresentIds.add(memberId);
    }
    setPresentIds(newPresentIds);
  };

  const handleSaveChanges = async () => {
    const idsToSave = Array.from(presentIds);
    try {
      await apiClient.post(`/sessions/${sessionId}/attendees`, {
        presentMemberIds: idsToSave,
      });
      showSuccessToast("Lista de presença salva com sucesso!");
    } catch (error) {
      console.error("[ParticipantesTab] Erro ao salvar presenças:", error);
      showErrorToast("Erro ao salvar a lista de presença.");
    }
  };

  const { presentes, ausentes } = useMemo(() => {
    const presentes = allMembers.filter((m) => presentIds.has(m.id));
    const ausentes = allMembers.filter((m) => !presentIds.has(m.id));
    return { presentes, ausentes };
  }, [allMembers, presentIds]);

  if (isLoading) return <p>Carregando lista de participantes...</p>;

  return (
    <div className="card">
      <h3>Controle de Presença</h3>
      <div className="participantes-layout">
        <div className="lista-participantes">
          <h4>Presentes ({presentes.length})</h4>
          <ul>
            {presentes.map((m) => (
              <li key={m.id}>
                {m.NomeCompleto}
                <button onClick={() => handleTogglePresence(m.id)}>
                  Marcar Falta
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lista-participantes">
          <h4>Ausentes ({ausentes.length})</h4>
          <ul>
            {ausentes.map((m) => (
              <li key={m.id}>
                {m.NomeCompleto}
                <button onClick={() => handleTogglePresence(m.id)}>
                  Marcar Presença
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        className="btn btn-primary"
        onClick={handleSaveChanges}
        style={{ marginTop: "1rem" }}
      >
        Salvar Alterações de Presença
      </button>
    </div>
  );
};

export default ParticipantesTab;
