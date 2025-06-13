import React, { useState } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching"; // Importa o nosso novo hook
import { useAuth } from "../../../hooks/useAuth";
import {
  getAllAvisos,
  createAviso,
  updateAviso,
  deleteAviso,
} from "../../../services/avisoService";
import Modal from "../../../components/modal/Modal";
import AvisoForm from "./AvisoForm";
import "./AvisosPage.css";

const AvisosPage = () => {
  // --- INÍCIO DA MODIFICAÇÃO ---
  // A lógica de state e fetching foi substituída por uma única linha!
  const {
    data: avisos,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getAllAvisos);
  // --- FIM DA MODIFICAÇÃO ---

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAviso, setCurrentAviso] = useState(null);
  const [apiError, setApiError] = useState(""); // State separado para erros de ações

  const { user } = useAuth();

  const openModalToCreate = () => {
    setCurrentAviso(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (aviso) => {
    setCurrentAviso(aviso);
    setIsModalOpen(true);
  };

  const handleSaveAviso = async (formData) => {
    try {
      setApiError("");
      if (currentAviso) {
        await updateAviso(currentAviso.id, formData);
      } else {
        await createAviso(formData);
      }
      refetch(); // Usa a função de refetch do nosso hook para atualizar a lista
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar aviso:", err);
      setApiError("Não foi possível salvar o aviso.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este aviso?")) {
      try {
        setApiError("");
        await deleteAviso(id);
        refetch(); // Atualiza a lista após apagar
      } catch (err) {
        console.error("Erro ao apagar aviso:", err);
        setApiError("Não foi possível apagar o aviso.");
      }
    }
  };

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  if (isLoading)
    return <div className="avisos-container">A carregar avisos...</div>;

  return (
    <div className="avisos-container">
      <div className="avisos-header">
        <h1>Mural de Avisos</h1>
        {canManage && (
          <button onClick={openModalToCreate} className="btn-novo-aviso">
            Criar Novo Aviso
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      {apiError && <p className="error-message">{apiError}</p>}

      <div className="avisos-list">
        {avisos.length === 0 && !isLoading ? (
          <p>Nenhum aviso para exibir no momento.</p>
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
