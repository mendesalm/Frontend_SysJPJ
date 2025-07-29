import React, { useState } from "react";
import BalaustreForm from "./BalaustreForm.jsx";
import { gerarBalaustreGoogleDocs } from "../../../services/balaustreService.js"; // Importa a função atualizada
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import "../../styles/TableStyles.css";

const GerarBalaustrePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    setGeneratedUrl("");
    try {
      const response = await gerarBalaustreGoogleDocs(formData); // Usa a função atualizada
      setGeneratedUrl(response.data.url);
      showSuccessToast("Balaústre gerado com sucesso!"); // Mensagem atualizada
    } catch {
      showErrorToast(
        "Falha ao gerar o balaústre. Verifique os dados e tente novamente."
      ); // Mensagem atualizada
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gerador de Balaústre</h1> {/* Título atualizado */}
      </div>

      {generatedUrl && (
        <div
          className="success-message"
          style={
            {
              /* ... */
            }
          }
        >
          <p>
            Documento gerado!{" "}
            <a href={generatedUrl} target="_blank" rel="noopener noreferrer">
              Clique aqui para abrir o balaústre.
            </a>
          </p>{" "}
          {/* Texto atualizado */}
        </div>
      )}

      <BalaustreForm
        onSave={handleSave}
        onCancel={() => {
          /* ... */
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default GerarBalaustrePage;
