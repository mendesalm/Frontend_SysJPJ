import React, { useState } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import * as comissoesService from "../../../services/comissoesService";
import { useAuth } from "../../../hooks/useAuth";
import Modal from "../../../components/modal/Modal";
import ComissaoForm from "./ComissaoForm";
import "./ComissoesPage.css";
import "../../styles/TableStyles.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const ComissoesPage = () => {
  const {
    data: comissoes,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(comissoesService.getComissoes);
  const { hasPermission } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComissao, setCurrentComissao] = useState(null);

  const canCreate = hasPermission("criarComissao");
  const canEdit = hasPermission("editarComissao");
  const canDelete = hasPermission("deletarComissao");

  const handleSave = async (formData) => {
    try {
      if (currentComissao) {
        await comissoesService.updateComissao(currentComissao.id, formData);
        showSuccessToast("Comissão atualizada com sucesso!");
      } else {
        await comissoesService.createComissao(formData);
        showSuccessToast("Comissão criada com sucesso!");
      }
      refetch();
      setIsModalOpen(false);
      setCurrentComissao(null);
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao salvar a comissão."
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar esta comissão?")) {
      try {
        await comissoesService.deleteComissao(id);
        showSuccessToast("Comissão apagada com sucesso!");
        refetch();
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Erro ao apagar a comissão."
        );
      }
    }
  };

  const openModal = (comissao = null) => {
    setCurrentComissao(comissao);
    setIsModalOpen(true);
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Comissões de Trabalho</h1>
        {canCreate && (
          <button
            onClick={() => openModal()}
            className="btn-action btn-approve"
          >
            Nova Comissão
          </button>
        )}
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="comissoes-list">
        {isLoading ? (
          <p>A carregar comissões...</p>
        ) : comissoes.length === 0 ? (
          <p>Nenhuma comissão de trabalho encontrada.</p>
        ) : (
          comissoes.map((comissao) => (
            <div key={comissao.id} className="comissao-card">
              <div className="comissao-card-header">
                <h3>{comissao.nome}</h3>
                <div className="comissao-card-actions">
                  {canEdit && (
                    <button
                      className="btn-action-icon"
                      onClick={() => openModal(comissao)}
                    >
                      ✏️
                    </button>
                  )}
                  {canDelete && (
                    <button
                      className="btn-action-icon btn-delete-icon"
                      onClick={() => handleDelete(comissao.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <span
                className={`tipo-badge tipo-${comissao.tipo.toLowerCase()}`}
              >
                {comissao.tipo}
              </span>
              <p className="datas">
                {new Date(comissao.dataInicio).toLocaleDateString()} -{" "}
                {new Date(comissao.dataFim).toLocaleDateString()}
              </p>
              <p className="comissao-descricao">{comissao.descricao}</p>
              <div className="membros-list">
                <strong>Membros:</strong>
                <ul>
                  {comissao.membros.map((membro) => (
                    <li key={membro.id}>{membro.NomeCompleto}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentComissao ? "Editar Comissão" : "Criar Nova Comissão"}
      >
        <ComissaoForm
          comissaoToEdit={currentComissao}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ComissoesPage;
