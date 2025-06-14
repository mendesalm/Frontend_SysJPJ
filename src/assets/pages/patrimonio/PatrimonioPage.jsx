import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getPatrimonios,
  createPatrimonio,
  updatePatrimonio,
} from "../../../services/patrimonioService";
import Modal from "../../../components/modal/Modal";
import PatrimonioForm from "./PatrimonioForm";
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

const PatrimonioPage = () => {
  // 1. Adicionando estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({ page: currentPage, limit: 10 }),
    [currentPage]
  );

  // 2. Atualizando a chamada do hook e a extração de dados
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getPatrimonios, [params]);
  const itens = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      const isUpdating = !!currentItem;
      if (isUpdating) {
        await updatePatrimonio(currentItem.id, formData);
      } else {
        await createPatrimonio(formData);
      }
      refetch();
      setIsModalOpen(false);
      showSuccessToast(
        `Item ${isUpdating ? "atualizado" : "criado"} com sucesso!`
      );
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Erro ao salvar o item.");
    }
  };

  const openCreateModal = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };
  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Inventário de Património</h1>
        {canManage && (
          <button onClick={openCreateModal} className="btn-action btn-approve">
            Adicionar Item
          </button>
        )}
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome do Item</th>
              <th>Data de Aquisição</th>
              <th>Valor (R$)</th>
              <th>Estado</th>
              {canManage && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : itens.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} style={{ textAlign: "center" }}>
                  Nenhum item de patrimônio cadastrado.
                </td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>
                    {new Date(item.dataAquisicao).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>{parseFloat(item.valorAquisicao).toFixed(2)}</td>
                  <td>{item.estadoConservacao}</td>
                  {canManage && (
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => openEditModal(item)}
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Adicionando os controles de paginação */}
      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentItem ? "Editar Item" : "Novo Item de Património"}
      >
        <PatrimonioForm
          itemToEdit={currentItem}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PatrimonioPage;
