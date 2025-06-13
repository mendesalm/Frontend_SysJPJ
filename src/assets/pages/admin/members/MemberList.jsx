import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataFetching } from "../../../../hooks/useDataFetching"; // 1. Importa o hook
import {
  getAllMembers,
  updateMember,
} from "../../../../services/memberService";
import "../../../../assets/styles/TableStyles.css";

const MemberList = () => {
  // 2. Substitui a lógica de busca de dados pela chamada ao hook
  const {
    data: members,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getAllMembers);

  // Mantemos um state separado para erros que podem ocorrer em ações do usuário
  const [actionError, setActionError] = useState("");

  const navigate = useNavigate();

  const handleUpdateStatus = async (memberId, newStatus) => {
    try {
      setActionError(""); // Limpa erros de ações anteriores
      await updateMember(memberId, { statusCadastro: newStatus });
      refetch(); // 3. Usa a função `refetch` do hook para atualizar a lista
    } catch (err) {
      console.error(`Erro ao atualizar status para ${newStatus}:`, err);
      setActionError(`Não foi possível atualizar o status do membro.`);
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

      {(fetchError || actionError) && (
        <p className="error-message">{fetchError || actionError}</p>
      )}

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
            {/* 4. Adicionado tratamento para estado vazio */}
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
