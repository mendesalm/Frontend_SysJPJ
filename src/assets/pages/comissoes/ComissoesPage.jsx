import React, { useState } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o nosso hook
import {
  createComissao,
  getComissoes,
} from "../../../services/comissoesService"; // 2. getComissoes é necessário para o hook
import { useAuth } from "../../../hooks/useAuth";
import Modal from "../../../components/modal/Modal";
import ComissaoForm from "./ComissaoForm";
import "./ComissoesPage.css";

const ComissoesPage = () => {
  // 3. A lógica de state e fetching é substituída por esta única linha
  const {
    data: comissoes,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getComissoes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState("");
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      setApiError("");
      await createComissao(formData);
      refetch(); // 4. Usa a função `refetch` do hook para atualizar a lista
      setIsModalOpen(false);
    } catch (err) {
      setApiError(err.response?.data?.message || "Erro ao salvar a comissão.");
      console.error(err);
    }
  };

  if (isLoading)
    return <div className="comissoes-container">A carregar...</div>;

  return (
    <div className="comissoes-container">
      <div className="comissoes-header">
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

      {/* Exibe o erro de carregamento inicial ou o erro de uma ação de API */}
      {(error || apiError) && (
        <p className="error-message">{error || apiError}</p>
      )}

      <div className="comissoes-list">
        {/* 5. Adicionada uma verificação para estado vazio */}
        {!isLoading && comissoes.length === 0 ? (
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
                {new Date(comissao.dataFim).toLocaleDateString()}
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
