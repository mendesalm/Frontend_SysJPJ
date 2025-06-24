// src/assets/pages/classificados/ClassificadosPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import * as classificadosService from "../../../services/classificadosService";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import Modal from "../../../components/modal/Modal";
import ClassificadoForm from "./ClassificadoForm";
import apiClient from "../../../services/apiClient";
import "./Classificados.css";

const ClassificadosPage = () => {
  const { user } = useAuth();
  const {
    data: classificados,
    isLoading,
    error,
    refetch,
  } = useDataFetching(classificadosService.getClassificados);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassificado, setSelectedClassificado] = useState(null);

  const handleSave = async (formData) => {
    try {
      if (selectedClassificado) {
        // A API de atualização só aceita campos de texto
        const textData = {};
        for (let pair of formData.entries()) {
          if (pair[0] !== "fotos") {
            textData[pair[0]] = pair[1];
          }
        }
        await classificadosService.updateClassificado(
          selectedClassificado.id,
          textData
        );
        showSuccessToast("Anúncio atualizado com sucesso!");
      } else {
        await classificadosService.createClassificado(formData);
        showSuccessToast("Anúncio criado com sucesso!");
      }
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao guardar o anúncio."
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem a certeza que deseja apagar este anúncio? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await classificadosService.deleteClassificado(id);
        showSuccessToast("Anúncio apagado com sucesso!");
        refetch();
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Não foi possível apagar o anúncio."
        );
      }
    }
  };

  const getFileUrl = (path) => {
    const baseURL = apiClient.defaults.baseURL.startsWith("http")
      ? apiClient.defaults.baseURL
      : window.location.origin;
    return `${baseURL}/${path}`.replace("/api/", "/");
  };

  const openModal = (classificado = null) => {
    setSelectedClassificado(classificado);
    setIsModalOpen(true);
  };

  return (
    <div className="classificados-page">
      <div className="table-header">
        <h1>Classificados da Loja</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          + Criar Anúncio
        </button>
      </div>

      {isLoading && <p>A carregar anúncios...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="classificados-grid">
        {classificados &&
          classificados.map((anuncio) => (
            <div key={anuncio.id} className="classificado-card">
              <div className="card-image-container">
                <img
                  src={
                    anuncio.fotos?.[0]
                      ? getFileUrl(anuncio.fotos[0].caminhoArquivo)
                      : "https://placehold.co/600x400/2c3e50/ecf0f1?text=Sem+Foto"
                  }
                  alt={anuncio.titulo}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <span className="card-tipo-anuncio">{anuncio.tipoAnuncio}</span>
                <h3 className="card-titulo">{anuncio.titulo}</h3>
                <p className="card-valor">
                  {anuncio.valor > 0
                    ? `R$ ${parseFloat(anuncio.valor).toFixed(2)}`
                    : "Consultar"}
                </p>
                <div className="card-autor">
                  <small>
                    Anunciado por: {anuncio.anunciante.NomeCompleto}
                  </small>
                </div>
              </div>
              {(user.id === anuncio.lodgeMemberId ||
                user.credencialAcesso === "Admin") && (
                <div className="card-actions">
                  <button
                    onClick={() => openModal(anuncio)}
                    className="btn-action btn-edit"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(anuncio.id)}
                    className="btn-action btn-delete"
                  >
                    Apagar
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClassificado ? "Editar Anúncio" : "Novo Anúncio"}
      >
        <ClassificadoForm
          anuncioToEdit={selectedClassificado}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ClassificadosPage;
