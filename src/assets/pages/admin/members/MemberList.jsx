import React from "react"; // O useState não é mais necessário aqui
import { useNavigate } from "react-router-dom";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import {
  getAllMembers,
  updateMember,
} from "../../../../services/memberService";
import "../../../../assets/styles/TableStyles.css";

// 1. Importando nossas funções de notificação
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";

const MemberList = () => {
  const {
    data: members,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getAllMembers);

  // 2. O state 'actionError' foi removido. Os toasts cuidarão do feedback.
  const navigate = useNavigate();

  const handleUpdateStatus = async (memberId, newStatus) => {
    try {
      await updateMember(memberId, { statusCadastro: newStatus });
      refetch();
      // 3. Adicionando feedback de sucesso
      showSuccessToast("Status do membro atualizado com sucesso!");
    } catch (err) {
      console.error(`Erro ao atualizar status para ${newStatus}:`, err);
      // 4. Adicionando feedback de erro
      showErrorToast("Não foi possível atualizar o status do membro.");
    }
  };

  if (isLoading) {
    return (
      <div className="table-page-container">A carregar lista de membros...</div>
    );
  }

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Membros</h1>
        <button
          onClick={() => navigate("/admin/members/create")}
          className="btn-action btn-approve"
        >
          + Novo Membro
        </button>
      </div>

      {/* 5. A exibição de erro de ação foi removida daqui */}
      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>Email</th>
              <th>Status do Cadastro</th>
              <th>Credencial</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && members.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhum membro encontrado.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id}>
                  <td>{member.NomeCompleto}</td>
                  <td>{member.Email}</td>
                  <td>
                    <span
                      className={`status-badge status-${
                        member.statusCadastro?.toLowerCase() || "pendente"
                      }`}
                    >
                      {member.statusCadastro}
                    </span>
                  </td>
                  <td>{member.credencialAcesso}</td>
                  <td className="actions-cell">
                    {member.statusCadastro === "Pendente" && (
                      <button
                        className="btn-action btn-approve"
                        onClick={() =>
                          handleUpdateStatus(member.id, "Aprovado")
                        }
                      >
                        Aprovar
                      </button>
                    )}
                    <button
                      className="btn-action btn-edit"
                      onClick={() =>
                        navigate(`/admin/members/edit/${member.id}`)
                      }
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
