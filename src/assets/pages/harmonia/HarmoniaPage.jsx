import React, { useState } from "react";
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

// 1. IMPORTAMOS AS NOSSAS FUNÇÕES DE NOTIFICAÇÃO
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const HarmoniaPage = () => {
  const {
    data: itens,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getHarmoniaItens);

  // 2. O ESTADO DE ERRO PARA AÇÕES NÃO É MAIS NECESSÁRIO
  // const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      await createHarmoniaItem(formData);
      refetch();
      setIsModalOpen(false);
      // 3. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
      showSuccessToast("Item de harmonia salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar o item:", err);
      // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
      showErrorToast(err.response?.data?.message || "Erro ao salvar o item.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este item?")) {
      try {
        await deleteHarmoniaItem(id);
        refetch();
        // 3. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
        showSuccessToast("Item apagado com sucesso!");
      } catch (err) {
        console.error("Erro ao apagar o item:", err);
        // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
        showErrorToast(err.response?.data?.message || "Erro ao apagar o item.");
      }
    }
  };

  if (isLoading)
    return <div className="table-page-container">A carregar...</div>;

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

      {/* 5. A EXIBIÇÃO DE ERRO É SIMPLIFICADA (APENAS PARA O FETCH INICIAL) */}
      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && itens.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Nenhum item de harmonia cadastrado.
                </td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr key={item.id}>
                  <td>{item.titulo}</td>
                  <td>{item.autor}</td>
                  <td>{item.categoria}</td>
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
