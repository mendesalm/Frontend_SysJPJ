import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
import {
  getHarmoniaItens,
  createHarmoniaItem,
  deleteHarmoniaItem,
} from "../../../services/harmoniaService";
import Modal from "../../../components/modal/Modal";
import HarmoniaForm from "./HarmoniaForm";
import "../../styles/TableStyles.css";

const HarmoniaPage = () => {
  // 2. Lógica de busca de dados simplificada com o hook
  const {
    data: itens,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getHarmoniaItens);

  const [actionError, setActionError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      setActionError("");
      await createHarmoniaItem(formData);
      refetch(); // 3. Atualiza a lista com `refetch`
      setIsModalOpen(false);
    } catch (err) {
      setActionError(err.response?.data?.message || "Erro ao salvar o item.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este item?")) {
      try {
        setActionError("");
        await deleteHarmoniaItem(id);
        refetch(); // 3. Atualiza a lista com `refetch`
      } catch (err) {
        setActionError(err.response?.data?.message || "Erro ao apagar o item.");
        console.error(err);
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

      {(fetchError || actionError) && (
        <p className="error-message">{fetchError || actionError}</p>
      )}

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
            {/* 4. Tratamento para estado vazio */}
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
