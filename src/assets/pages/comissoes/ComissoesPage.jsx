import React, { useState, useMemo } from "react";
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

const ComissoesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({ page: currentPage, limit: 9 }),
    [currentPage]
  ); // 9 cards por página
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getComissoes, [params]);

  const comissoes = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      await createComissao(formData);
      // Se um novo item for criado, volta para a primeira página para vê-lo
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        refetch();
      }
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

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />

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
