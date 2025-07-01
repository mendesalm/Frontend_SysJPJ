import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import {
  getAllMembers,
  updateMember,
} from "../../../../services/memberService";
import "../../../../assets/styles/TableStyles.css";
import "../../../../assets/styles/FormStyles.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";

const MemberList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: allMembers,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getAllMembers);

  const filteredMembers = useMemo(() => {
    if (!allMembers) return [];
    return allMembers.filter(
      (member) =>
        (member.NomeCompleto &&
          member.NomeCompleto.toLowerCase().includes(
            searchQuery.toLowerCase()
          )) ||
        (member.Email &&
          member.Email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allMembers, searchQuery]);

  const handleUpdateStatus = async (memberId, newStatus) => {
    try {
      await updateMember(memberId, { statusCadastro: newStatus });
      showSuccessToast("Status do membro atualizado com sucesso!");
      refetch();
    } catch (err) {
      showErrorToast("Não foi possível atualizar o status do membro.");
      console.error(err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

      <div className="filter-bar" style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Buscar membro por nome ou email..."
          className="form-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Foto (thumbnail)</th>
              <th>CIM</th>
              <th>Nome</th>
              <th>Grau</th>
              <th>Cargo</th>
              <th>Status Cadastro</th>
              <th>Credencial</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Nenhum membro encontrado.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                // NOVO: Adicionada classe condicional para membros falecidos
                <tr
                  key={member.id}
                  className={
                    member.Situacao === "Falecido" ? "deceased-row" : ""
                  }
                >
                  <td>
                    {member.FotoPessoal_Caminho ? (
                      <img
                        src={member.FotoPessoal_Caminho.startsWith('http') ? member.FotoPessoal_Caminho : `/uploads/${member.FotoPessoal_Caminho.replace(/^(?:\/uploads\/|uploads\/)/, '')}` }
                        alt="Foto do Membro"
                        style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                      />
                    ) : (
                      <img
                        src="/src/assets/images/avatar_placeholder.png"
                        alt="Placeholder"
                        style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                      />
                    )}
                  </td>
                  <td>{member.CIM}</td>
                  <td>{member.NomeCompleto}</td>
                  <td>{member.Graduacao}</td>
                  <td>{member.cargoAtual === null || member.cargoAtual === "Sem cargo definido" ? "Obreiro" : member.cargoAtual}</td>
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
                    {/* NOVO: Condição para não mostrar botão para membros falecidos */}
                    {member.statusCadastro === "Pendente" &&
                      member.Situacao !== "Falecido" && (
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
                      // NOVO: Desabilita o botão para membros falecidos
                      disabled={member.Situacao === "Falecido"}
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
