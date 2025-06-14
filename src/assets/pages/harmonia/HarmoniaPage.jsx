import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getHarmoniaItens,
  createHarmoniaItem,
  deleteHarmoniaItem,
} from "../../../services/harmoniaService";
import Modal from "../../../components/modal/Modal";
import HarmoniaForm from "./HarmoniaForm";
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

const HarmoniaPage = () => {
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
  } = useDataFetching(getHarmoniaItens, [params]);

  const itens = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      await createHarmoniaItem(formData);
      // Se um novo item for criado, volta para a primeira página para vê-lo
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        refetch();
      }
      setIsModalOpen(false);
      showSuccessToast("Item de harmonia salvo com sucesso!");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Erro ao salvar o item.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este item?")) {
      try {
        await deleteHarmoniaItem(id);
        refetch();
        showSuccessToast("Item apagado com sucesso!");
      } catch (err) {
        showErrorToast(err.response?.data?.message || "Erro ao apagar o item.");
      }
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Harmonia</h1>
        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-action btn-approve"
          >
            Adicionar Áudio
          </button>
        )}
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Categoria</th>
              <th>Subcategoria</th>
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
            ) : itens.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhum item de harmonia cadastrado.
                </td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr key={item.id}>
                  <td>{item.titulo}</td>
                  <td>{item.autor}</td>
                  <td>{item.categoria}</td>
                  <td>{item.subcategoria}</td>
                  <td className="actions-cell">
                    {canManage && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-action btn-delete"
                      >
                        Apagar
                      </button>
                    )}
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
        title="Novo Item de Harmonia"
      >
        <HarmoniaForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HarmoniaPage;
