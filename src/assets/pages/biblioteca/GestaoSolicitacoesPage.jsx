import React from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getSolicitacoesPendentes,
  aprovarSolicitacao,
  rejeitarSolicitacao,
} from "../../../services/bibliotecaService";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import "../../styles/TableStyles.css";

const GestaoSolicitacoesPage = () => {
  const {
    data: solicitacoes,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getSolicitacoesPendentes);

  const handleAprovar = async (id) => {
    try {
      await aprovarSolicitacao(id);
      showSuccessToast("Solicitação aprovada com sucesso!");
      refetch();
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao aprovar solicitação."
      );
    }
  };

  const handleRejeitar = async (id) => {
    if (window.confirm("Tem certeza que deseja rejeitar esta solicitação?")) {
      try {
        await rejeitarSolicitacao(id);
        showSuccessToast("Solicitação rejeitada.");
        refetch();
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Erro ao rejeitar solicitação."
        );
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gerir Solicitações de Empréstimo</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Livro Solicitado</th>
              <th>Membro Solicitante</th>
              <th>Data da Solicitação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4">A carregar solicitações...</td>
              </tr>
            ) : solicitacoes.length === 0 ? (
              <tr>
                <td colSpan="4">Nenhuma solicitação pendente.</td>
              </tr>
            ) : (
              solicitacoes.map((sol) => (
                <tr key={sol.id}>
                  <td>{sol.livro.titulo}</td>
                  <td>{sol.membro.NomeCompleto}</td>
                  <td>{new Date(sol.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleAprovar(sol.id)}
                      className="btn-action btn-approve"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleRejeitar(sol.id)}
                      className="btn-action btn-delete"
                    >
                      Rejeitar
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

export default GestaoSolicitacoesPage;
