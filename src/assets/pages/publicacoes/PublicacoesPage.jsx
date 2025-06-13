import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
import {
  getPublicacoes,
  createPublicacao,
} from "../../../services/publicacaoService";
import Modal from "../../../components/modal/Modal";
import PublicacaoForm from "./PublicacaoForm";
import "./PublicacoesPage.css";
import "../../styles/TableStyles.css"; // Importando para ter o estilo do cabeçalho

const PublicacoesPage = () => {
  // 2. Lógica de busca de dados substituída pela chamada ao hook
  const {
    data: publicacoes,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getPublicacoes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const { user } = useAuth();

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSave = async (formData) => {
    try {
      setActionError("");
      await createPublicacao(formData);
      refetch(); // 3. Atualiza a lista com `refetch`
      setIsModalOpen(false);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Erro ao salvar a publicação."
      );
      console.error(err);
    }
  };

  if (isLoading)
    return <div className="table-page-container">A carregar...</div>;

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

      {(fetchError || actionError) && (
        <p className="error-message">{fetchError || actionError}</p>
      )}

      <div className="publicacoes-grid">
        {/* 4. Adicionado tratamento para estado vazio */}
        {!isLoading && publicacoes.length === 0 ? (
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
