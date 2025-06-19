import React, { useState } from "react";
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

const AvisosPage = () => {
  // Chamada simplificada do hook, sem paginação.
  const {
    data: avisos,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getAllAvisos);

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
      refetch(); // Apenas busca os dados novamente.
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
