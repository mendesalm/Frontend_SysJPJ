import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
import {
  getPatrimonios,
  createPatrimonio,
  updatePatrimonio,
} from "../../../services/patrimonioService";
import Modal from "../../../components/modal/Modal";
import PatrimonioForm from "./PatrimonioForm";
import "../../styles/TableStyles.css"; // Reutilizando CSS

const PatrimonioPage = () => {
  // 2. Lógica de busca de dados substituída pela chamada ao hook
  const {
    data: itens,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getPatrimonios);

  const [actionError, setActionError] = useState(""); // State específico para erros de ações (salvar, etc.)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      setActionError(""); // Limpa erros de ações anteriores
      if (currentItem) {
        await updatePatrimonio(currentItem.id, formData);
      } else {
        await createPatrimonio(formData);
      }
      refetch(); // 3. Usa a função `refetch` para atualizar a lista
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar o item de patrimônio:", err);
      setActionError(err.response?.data?.message || "Erro ao salvar o item.");
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

  // O estado de carregamento inicial agora vem diretamente do hook
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

      {/* Exibe o erro de carregamento inicial ou o erro de uma ação */}
      {(fetchError || actionError) && (
        <p className="error-message" onClick={() => setActionError("")}>
          {fetchError || actionError}
        </p>
      )}

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
            {/* 4. Adicionado tratamento para estado vazio */}
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
