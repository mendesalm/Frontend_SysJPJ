import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { updateSessionAttendance } from "../../../../../services/sessionService";
import { showSuccessToast, showErrorToast } from "../../../../../utils/notifications";

const ParticipantesTab = forwardRef(({ sessionId, attendees: initialAttendees, refetchSession }, ref) => {
  ParticipantesTab.displayName = 'ParticipantesTab';
  const [attendees, setAttendees] = useState(initialAttendees);
  const [originalAttendees, setOriginalAttendees] = useState(initialAttendees);

  useEffect(() => {
    setAttendees(initialAttendees);
    setOriginalAttendees(initialAttendees);
  }, [initialAttendees]);

  const handleStatusChange = (memberId, newStatus) => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee.membro.id === memberId
          ? { ...attendee, statusPresenca: newStatus }
          : attendee
      )
    );
  };

  const handleSaveAttendance = useCallback(async () => {
    const changedAttendees = attendees.filter((attendee) => {
      const original = originalAttendees.find(
        (orig) => orig.membro.id === attendee.membro.id
      );
      return original && original.statusPresenca !== attendee.statusPresenca;
    }).map(attendee => ({
        lodgeMemberId: attendee.membro.id,
        statusPresenca: attendee.statusPresenca
    }));

    if (changedAttendees.length === 0) {
      showErrorToast("Nenhuma alteração para salvar.");
      return;
    }

    try {
      await updateSessionAttendance(sessionId, changedAttendees);
      showSuccessToast("Presença atualizada com sucesso!");
      refetchSession(); // Refetch parent session data to update counts
    } catch (err) {
      console.error("Erro ao salvar presença:", err);
      showErrorToast("Falha ao atualizar a presença.");
    }
  }, [attendees, originalAttendees, sessionId, refetchSession]);

  useImperativeHandle(ref, () => ({
    handleSaveAttendance,
  }));

  return (
    <div className="card participantes-tab-card">
      <h3>Registro de Presença</h3>
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome do Irmão</th>
              <th>Status de Presença</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees
                .filter(attendee => attendee.membro && attendee.membro.id)
                .map((attendee) => (
                  <tr key={attendee.membro.id}>
                    <td>{attendee.membro?.NomeCompleto}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={attendee.statusPresenca === "Presente"}
                        onChange={(e) =>
                          handleStatusChange(
                            attendee.membro.id,
                            e.target.checked ? "Presente" : "Ausente"
                          )
                        }
                      />
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="2">Nenhum participante encontrado para esta sessão.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ParticipantesTab;