import React, { useState, useEffect } from "react";
import { useDataFetching } from "../../../../../hooks/useDataFetching";
import {
  getSessionById,
  updateResponsavelJantar,
} from "../../../../../services/sessionService";
import { getAllMembers } from "../../../../../services/memberService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications";

const JantarTab = ({ sessionId }) => {
  const { data: session, refetch: refetchSession } = useDataFetching(
    getSessionById,
    [sessionId]
  );
  const { data: members } = useDataFetching(getAllMembers, [{ limit: 999 }]);

  const [tipo, setTipo] = useState("");
  const [responsavelId, setResponsavelId] = useState("");

  useEffect(() => {
    if (session) {
      setTipo(session.tipoResponsabilidadeJantar || "Sequencial");
      setResponsavelId(session.responsavelJantarLodgeMemberId || "");
    }
  }, [session]);

  const handleSave = async () => {
    try {
      await updateResponsavelJantar(sessionId, {
        tipo: tipo,
        membroId: tipo === "Manual" ? responsavelId : null,
      });
      showSuccessToast("Responsabilidade pelo jantar atualizada!");
      refetchSession();
    } catch (err) {
      console.error(err);
      showErrorToast("Falha ao atualizar responsabilidade.");
    }
  };

  if (!session) return <p>Carregando...</p>;

  return (
    <div className="card">
      <h3>Gerenciar Jantar da Sessão</h3>
      <p>
        O responsável padrão é definido pela escala sequencial. Você pode
        designar manualmente um responsável ou marcar o jantar como
        institucional para esta sessão específica.
      </p>

      <div className="form-group">
        <label>Tipo de Responsabilidade</label>
        <select
          className="form-select"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="Sequencial">Sequencial (Automático da Escala)</option>
          <option value="Manual">Designação Manual</option>
          <option value="Institucional">Institucional (Loja)</option>
        </select>
      </div>

      {tipo === "Manual" && (
        <div className="form-group">
          <label>Selecione o Responsável</label>
          <select
            className="form-select"
            value={responsavelId}
            onChange={(e) => setResponsavelId(e.target.value)}
          >
            <option value="">-- Escolha um Irmão --</option>
            {members?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.NomeCompleto}
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleSave}>
        Salvar Alterações
      </button>
    </div>
  );
};

export default JantarTab;
