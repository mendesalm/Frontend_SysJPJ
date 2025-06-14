import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import {
  getAllMembers,
  updateMember,
} from "../../../../services/memberService";
import "../../../../assets/styles/TableStyles.css";
import "../../../../assets/styles/FormStyles.css"; // Importamos para usar o estilo do .form-input
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";

// --- Componente auxiliar para os controles de paginação ---
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <div
      className="pagination-controls"
      style={{
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>
    </div>
  );
};

const MemberList = () => {
  const navigate = useNavigate();

  // 1. ESTADO PARA CONTROLE DA PAGINAÇÃO E FILTROS
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit] = useState(10); // Define quantos itens por página

  // `useMemo` garante que o objeto de parâmetros só seja recriado quando um valor de dependência mudar.
  const params = useMemo(
    () => ({
      page: currentPage,
      limit,
      search: searchQuery,
    }),
    [currentPage, limit, searchQuery]
  );

  // 2. O HOOK AGORA RECEBE OS PARÂMETROS E ATUALIZA AUTOMATICAMENTE QUANDO ELES MUDAM
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getAllMembers, [params]);

  // 3. EXTRAÍMOS OS DADOS E A PAGINAÇÃO DA RESPOSTA DA API
  const members = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1, currentPage: 1 };

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
    setCurrentPage(1); // Sempre volta para a primeira página ao fazer uma nova busca
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

      {/* 4. BARRA DE BUSCA E FILTRO */}
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
              <th>Nome Completo</th>
              <th>Email</th>
              <th>Status do Cadastro</th>
              <th>Credencial</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : members.length === 0 ? (
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

      {/* 5. CONTROLES DE PAGINAÇÃO */}
      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default MemberList;
