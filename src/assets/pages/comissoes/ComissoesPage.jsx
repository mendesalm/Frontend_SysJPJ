import React, { useState } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  createComissao,
  getComissoes,
} from "../../../services/comissoesService";
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
  } = useDataFetching(getComissoes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      await createComissao(formData);
      refetch();
      setIsModalOpen(false);
      showSuccessToast("Comissão salva com sucesso!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Erro ao salvar a comissão.";
      showErrorToast(errorMsg);
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Comissões de Trabalho</h1>
        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
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
              <h3>{comissao.nome}</h3>
              <span
                className={`tipo-badge tipo-${comissao.tipo.toLowerCase()}`}
              >
                {comissao.tipo}
              </span>
              <p className="datas">
                {new Date(comissao.dataInicio).toLocaleDateString()} -{" "}
                {comissao.dataFim
                  ? new Date(comissao.dataFim).toLocaleDateString()
                  : "Presente"}
              </p>
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
        title="Nova Comissão"
      >
        <ComissaoForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ComissoesPage;
