// src/assets/pages/admin/lojas/GestaoLojasPage.jsx
import React, { useState } from "react";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import * as lojaService from "../../../../services/lojaService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";
import Modal from "../../../../components/modal/Modal";
import LojaForm from "./LojaForm";
import "../../../styles/TableStyles.css";

const GestaoLojasPage = () => {
  const {
    data: lojas,
    isLoading,
    error,
    refetch,
  } = useDataFetching(lojaService.getAllLojas);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLoja, setCurrentLoja] = useState(null);

  const handleSave = async (formData) => {
    try {
      if (currentLoja) {
        await lojaService.updateLoja(currentLoja.id, formData);
        showSuccessToast("Loja atualizada com sucesso!");
      } else {
        await lojaService.createLoja(formData);
        showSuccessToast("Loja criada com sucesso!");
      }
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Erro ao salvar a loja.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja apagar esta loja? A ação não pode ser desfeita."
      )
    ) {
      try {
        await lojaService.deleteLoja(id);
        showSuccessToast("Loja apagada com sucesso!");
        refetch();
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Não foi possível apagar a loja."
        );
      }
    }
  };

  const openModal = (loja = null) => {
    setCurrentLoja(loja);
    setIsModalOpen(true);
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Lojas Externas</h1>
        <button onClick={() => openModal()} className="btn-action btn-approve">
          + Cadastrar Loja
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Número</th>
              <th>Oriente</th>
              <th>Potência</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">A carregar lojas...</td>
              </tr>
            ) : (
              (lojas || []).map((loja) => (
                <tr key={loja.id}>
                  <td>{loja.nome}</td>
                  <td>{loja.numero || "N/A"}</td>
                  <td>{`${loja.cidade}-${loja.estado}`}</td>
                  <td>{loja.potencia}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => openModal(loja)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(loja.id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentLoja ? "Editar Loja" : "Cadastrar Nova Loja"}
      >
        <LojaForm
          lojaToEdit={currentLoja}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default GestaoLojasPage;
