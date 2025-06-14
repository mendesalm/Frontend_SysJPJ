import React, { useState, useMemo } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getContas,
  createConta,
  updateConta,
  deleteConta,
} from "../../../services/financeService";
import Modal from "../../../components/modal/Modal";
import ContaForm from "./ContaForm";
import "../../styles/TableStyles.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

// Componente auxiliar para os controles de paginação
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

const PlanoContasPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({ page: currentPage, limit: 10 }),
    [currentPage]
  );
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getContas, [params]);

  const contas = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConta, setCurrentConta] = useState(null);

  const handleSave = async (formData) => {
    try {
      const isUpdating = !!currentConta;
      if (isUpdating) {
        await updateConta(currentConta.id, formData);
      } else {
        await createConta(formData);
      }
      refetch();
      setIsModalOpen(false);
      showSuccessToast(
        `Conta ${isUpdating ? "atualizada" : "criada"} com sucesso!`
      );
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Erro ao salvar a conta.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Atenção: só é possível apagar contas que não possuem lançamentos. Deseja continuar?"
      )
    ) {
      try {
        await deleteConta(id);
        refetch();
        showSuccessToast("Conta apagada com sucesso!");
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Não foi possível apagar a conta."
        );
      }
    }
  };

  const openModalToCreate = () => {
    setCurrentConta(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (conta) => {
    setCurrentConta(conta);
    setIsModalOpen(true);
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Plano de Contas</h1>
        <button onClick={openModalToCreate} className="btn-action btn-approve">
          Nova Conta
        </button>
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome da Conta</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : contas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Nenhuma conta cadastrada no plano de contas.
                </td>
              </tr>
            ) : (
              contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.nome}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        conta.tipo === "Receita"
                          ? "status-aprovado"
                          : "status-rejeitado"
                      }`}
                    >
                      {conta.tipo}
                    </span>
                  </td>
                  <td>{conta.descricao}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => openModalToEdit(conta)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(conta.id)}
                    >
                      Apagar
                    </button>
                  </td>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentConta ? "Editar Conta" : "Criar Nova Conta"}
      >
        <ContaForm
          contaToEdit={currentConta}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlanoContasPage;
