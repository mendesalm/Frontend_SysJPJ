import React, { useState } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
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

// 1. IMPORTAMOS AS NOSSAS FUNÇÕES DE NOTIFICAÇÃO
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const AvisosPage = () => {
  const {
    data: avisos,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getAllAvisos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAviso, setCurrentAviso] = useState(null);

  // 2. O ESTADO DE ERRO PARA AÇÕES NÃO É MAIS NECESSÁRIO
  // const [apiError, setApiError] = useState('');

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
      // 3. REMOVEMOS A LIMPEZA DO ESTADO DE ERRO ANTIGO
      // setApiError('');
      const isUpdating = !!currentAviso;
      if (isUpdating) {
        await updateAviso(currentAviso.id, formData);
      } else {
        await createAviso(formData);
      }
      refetch();
      setIsModalOpen(false);

      // 4. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
      showSuccessToast(
        `Aviso ${isUpdating ? "atualizado" : "criado"} com sucesso!`
      );
    } catch (err) {
      console.error("Erro ao salvar aviso:", err);
      // 5. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
      // setApiError("Não foi possível salvar o aviso.");
      showErrorToast("Não foi possível salvar o aviso.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar este aviso?")) {
      try {
        // 3. REMOVEMOS A LIMPEZA DO ESTADO DE ERRO ANTIGO
        // setApiError('');
        await deleteAviso(id);
        refetch();

        // 4. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
        showSuccessToast("Aviso apagado com sucesso!");
      } catch (err) {
        console.error("Erro ao apagar aviso:", err);
        // 5. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
        // setApiError('Não foi possível apagar o aviso.');
        showErrorToast("Não foi possível apagar o aviso.");
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

      {/* 6. A EXIBIÇÃO DE ERRO É SIMPLIFICADA (APENAS PARA O FETCH INICIAL) */}
      {/* O erro de ação agora é um toast e não precisa ser renderizado aqui. */}
      {error && <p className="error-message">{error}</p>}

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
