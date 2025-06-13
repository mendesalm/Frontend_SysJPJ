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

// 1. IMPORTAMOS AS NOSSAS FUNÇÕES DE NOTIFICAÇÃO
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const ComissoesPage = () => {
  const {
    data: comissoes,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getComissoes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 2. O ESTADO DE ERRO PARA AÇÕES NÃO É MAIS NECESSÁRIO
  // const [apiError, setApiError] = useState('');

  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      // 3. REMOVEMOS A LIMPEZA DO ESTADO DE ERRO ANTIGO
      // setApiError('');
      await createComissao(formData);
      refetch();
      setIsModalOpen(false);

      // 4. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
      showSuccessToast("Comissão salva com sucesso!");
    } catch (err) {
      // 5. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
      const errorMsg =
        err.response?.data?.message || "Erro ao salvar a comissão.";
      showErrorToast(errorMsg);
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

      {/* 6. A EXIBIÇÃO DE ERRO É SIMPLIFICADA (APENAS PARA O FETCH INICIAL) */}
      {error && <p className="error-message">{error}</p>}

      <div className="comissoes-list">
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
