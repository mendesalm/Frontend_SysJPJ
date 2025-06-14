import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getPublicacoes,
  createPublicacao,
} from "../../../services/publicacaoService";
import Modal from "../../../components/modal/Modal";
import PublicacaoForm from "./PublicacaoForm";
import "./PublicacoesPage.css";
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

const PublicacoesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // Usamos 9 para um grid 3x3
  const params = useMemo(
    () => ({ page: currentPage, limit: 9 }),
    [currentPage]
  );
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getPublicacoes, [params]);

  const publicacoes = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      await createPublicacao(formData);
      refetch();
      setIsModalOpen(false);
      showSuccessToast("Publicação salva com sucesso!");
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao salvar a publicação."
      );
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Publicações e Trabalhos</h1>
        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-action btn-approve"
          >
            Nova Publicação
          </button>
        )}
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="publicacoes-grid">
        {isLoading ? (
          <p>A carregar publicações...</p>
        ) : publicacoes.length === 0 ? (
          <p>Nenhuma publicação ou trabalho encontrado.</p>
        ) : (
          publicacoes.map((pub) => (
            <div key={pub.id} className="publicacao-card">
              <div className="publicacao-icon">📄</div>
              <h3>{pub.nome}</h3>
              <p>
                <strong>Tema:</strong> {pub.tema}
              </p>
              <p>
                <strong>Autor:</strong>{" "}
                {pub.autorOuUploader?.NomeCompleto || "N/A"}
              </p>
              {pub.grau && (
                <p>
                  <strong>Grau:</strong> {pub.grau}
                </p>
              )}
              <a
                href={`http://localhost:3001/${pub.path}`}
                target="_blank"
                rel="noreferrer"
                className="btn-download"
              >
                Ver / Baixar
              </a>
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
        title="Nova Publicação"
      >
        <PublicacaoForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PublicacoesPage;
