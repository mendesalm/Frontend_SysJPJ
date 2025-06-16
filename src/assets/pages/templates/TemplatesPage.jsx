// src/assets/pages/templates/TemplatesPage.jsx
import React, { useState, useEffect } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getAllTemplates,
  getAvailablePlaceholders,
  updateTemplate,
} from "../../../services/templateService";
import Modal from "../../../components/modal/Modal";
import TemplateEditor from "./TemplateEditor";
import "../../styles/TableStyles.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const TemplatesPage = () => {
  const {
    data: templates,
    isLoading: isLoadingTemplates,
    error: errorTemplates,
    refetch,
  } = useDataFetching(getAllTemplates);
  const [placeholders, setPlaceholders] = useState({});
  const [isLoadingPlaceholders, setIsLoadingPlaceholders] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  useEffect(() => {
    async function fetchPlaceholders() {
      try {
        const response = await getAvailablePlaceholders();
        setPlaceholders(response.data);
      } catch (error) {
        showErrorToast("Erro ao buscar placeholders.");
        console.error("Erro ao buscar placeholders:", error);
      } finally {
        setIsLoadingPlaceholders(false);
      }
    }
    fetchPlaceholders();
  }, []);

  const handleEditClick = (template) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  const handleSaveTemplate = async (id, templateData) => {
    try {
      await updateTemplate(id, templateData);
      refetch(); // Atualiza a lista de templates
      setIsModalOpen(false);
      showSuccessToast("Template atualizado com sucesso!");
    } catch (error) {
      showErrorToast("Falha ao atualizar o template.");
      console.error("Erro ao atualizar o template:", error);
    }
  };

  const isLoading = isLoadingTemplates || isLoadingPlaceholders;

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Templates de E-mail</h1>
      </div>

      {errorTemplates && <p className="error-message">{errorTemplates}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Gatilho do Evento</th>
              <th>Assunto do E-mail</th>
              <th style={{ width: "150px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  A carregar templates...
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  Nenhum template encontrado.
                </td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.eventoGatilho}</td>
                  <td>{template.assunto}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEditClick(template)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {currentTemplate && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Editando Template: ${currentTemplate.eventoGatilho}`}
        >
          <TemplateEditor
            template={currentTemplate}
            placeholders={placeholders}
            onSave={handleSaveTemplate}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default TemplatesPage;
