import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getAllAvisos,
  createAviso,
  updateAviso,
  deleteAviso,
} from "../../../services/avisoService";
import Modal from "../../../components/modal/Modal";
import AvisoForm from "./AvisoForm";
import "./AvisosPage.css";
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

const AvisosPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({ page: currentPage, limit: 5 }),
    [currentPage]
  ); // 5 avisos por página
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getAllAvisos, [params]);

  const avisos = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAviso, setCurrentAviso] = useState(null);
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSaveAviso = async (formData) => {
    try {
      const isUpdating = !!currentAviso;
      if (isUpdating) {
        await updateAviso(currentAviso.id, formData);
      } else {
        await createAviso(formData);
      }
      // Se um novo aviso for criado, volta para a primeira página para vê-lo
      if (!isUpdating && currentPage !== 1) {
        setCurrentPage(1);
      } else {
        refetch();
      }
      setIsModalOpen(false);
      showSuccessToast(
        `Aviso ${isUpdating ? "atualizado" : "criado"} com sucesso!`
      );
    } catch (err) {
      showErrorToast("Não foi possível salvar o aviso.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este aviso?")) {
      try {
        await deleteAviso(id);
        refetch();
        showSuccessToast("Aviso apagado com sucesso!");
      } catch (err) {
        showErrorToast("Não foi possível apagar o aviso.");
        console.error(err);
      }
    }
  };

  const openModalToCreate = () => {
    setCurrentAviso(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (aviso) => {
    setCurrentAviso(aviso);
    setIsModalOpen(true);
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Mural de Avisos</h1>
        {canManage && (
          <button
            onClick={openModalToCreate}
            className="btn-action btn-approve"
          >
            Criar Novo Aviso
          </button>
        )}
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="avisos-list">
        {isLoading ? (
          <p>A carregar avisos...</p>
        ) : avisos.length === 0 ? (
          <p>Nenhum aviso para exibir.</p>
        ) : (
          avisos.map((aviso) => (
            <div
              key={aviso.id}
              className={`aviso-card ${aviso.fixado ? "fixado" : ""}`}
            >
              {aviso.fixado && (
                <span className="aviso-fixado-badge">📌 Fixo</span>
              )}
              <div className="aviso-card-header">
                <h2>{aviso.titulo}</h2>
                {canManage && (
                  <div className="aviso-actions">
                    <button
                      onClick={() => openModalToEdit(aviso)}
                      className="btn-action btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(aviso.id)}
                      className="btn-action btn-delete"
                    >
                      Apagar
                    </button>
                  </div>
                )}
              </div>
              <p className="aviso-conteudo">{aviso.conteudo}</p>
              <div className="aviso-footer">
                <span>Por: {aviso.autor?.NomeCompleto || "Sistema"}</span>
                <span>
                  Publicado: {new Date(aviso.createdAt).toLocaleDateString()}
                </span>
                {aviso.dataExpiracao && (
                  <span>
                    Expira em:{" "}
                    {new Date(aviso.dataExpiracao).toLocaleDateString()}
                  </span>
                )}
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
        title={currentAviso ? "Editar Aviso" : "Criar Novo Aviso"}
      >
        <AvisoForm
          avisoToEdit={currentAviso}
          onSave={handleSaveAviso}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AvisosPage;
