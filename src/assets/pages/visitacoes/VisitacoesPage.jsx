// src/assets/pages/visitacoes/VisitacoesPage.jsx
import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import { getVisitas, deleteVisita } from "../../../services/visitacaoService";
// import Modal from '../../../components/modal/Modal'; // Descomente quando o formulário for criado
// import VisitacaoForm from './VisitacaoForm'; // Descomente quando o formulário for criado
import "../../styles/TableStyles.css";
import "../../styles/FormStyles.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
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

const VisitacoesPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const params = useMemo(
    () => ({ page: currentPage, limit: 10, search: searchQuery }),
    [currentPage, searchQuery]
  );
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getVisitas, [params]);

  const visitas = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster" ||
    user?.credencialAcesso === "Chanceler"; // Exemplo de permissão

  const handleDelete = async (id) => {
    if (
      window.confirm("Tem certeza que deseja apagar este registro de visita?")
    ) {
      try {
        await deleteVisita(id);
        refetch();
        showSuccessToast("Registro de visita apagado com sucesso!");
      } catch (err) {
        showErrorToast("Não foi possível apagar o registro.");
        console.error(err);
      }
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Registros de Visitação</h1>
        {canManage && (
          <button
            className="btn-action btn-approve"
            onClick={() => alert("Abrir modal de criação")}
          >
            + Novo Registro
          </button>
        )}
      </div>

      <div className="filter-bar" style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Buscar por nome do membro ou da loja..."
          className="form-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Membro</th>
              <th>Loja Visitada</th>
              <th>Oriente</th>
              <th>Data da Visita</th>
              <th>Tipo de Sessão</th>
              {canManage && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : visitas.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} style={{ textAlign: "center" }}>
                  Nenhum registro de visitação encontrado.
                </td>
              </tr>
            ) : (
              visitas.map((visita) => (
                <tr key={visita.id}>
                  <td>{visita.membro?.NomeCompleto || "N/A"}</td>
                  <td>{visita.nomeLojaVisitada}</td>
                  <td>{visita.orienteLojaVisitada}</td>
                  <td>
                    {new Date(visita.dataVisita).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>{visita.tipoSessao}</td>
                  {canManage && (
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => alert(`Editar visita ${visita.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(visita.id)}
                      >
                        Apagar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />

      {/* O Modal para o formulário de criação/edição viria aqui */}
    </div>
  );
};

export default VisitacoesPage;
