import React, { useState } from "react";
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

const PatrimonioPage = () => {
  const {
    data: itens,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getPatrimonios);

  // O state 'actionError' não é mais necessário, pois o toast cuidará disso.
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
      // --- INÍCIO DA MODIFICAÇÃO ---
      // Exibe uma notificação de sucesso
      showSuccessToast(
        `Item de patrimônio ${
          isUpdating ? "atualizado" : "criado"
        } com sucesso!`
      );
      // --- FIM DA MODIFICAÇÃO ---
    } catch (err) {
      console.error("Erro ao salvar o item de patrimônio:", err);
      // --- INÍCIO DA MODIFICAÇÃO ---
      // Exibe uma notificação de erro
      const errorMsg = err.response?.data?.message || "Erro ao salvar o item.";
      showErrorToast(errorMsg);
      // --- FIM DA MODIFICAÇÃO ---
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

  if (isLoading)
    return (
      <div className="table-page-container">
        A carregar inventário de património...
      </div>
    );

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

      {/* A exibição de erro agora é feita pelo Toast, mas podemos manter o erro de fetch inicial */}
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
            {!isLoading && itens.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} style={{ textAlign: "center" }}>
                  Nenhum item de patrimônio cadastrado.
                </td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{new Date(item.dataAquisicao).toLocaleDateString()}</td>
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
