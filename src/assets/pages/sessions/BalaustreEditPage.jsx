import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BalaustreForm from "./BalaustreForm.jsx";
import {
  getBalaustre,
  updateBalaustre,
} from "../../../services/balaustreService.js";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../utils/notifications.js";
import "../../../assets/styles/TableStyles.css";
import FormPageLayout from "../../../components/layout/FormPageLayout.jsx";

const BalaustreEditPage = () => {
  const { id } = useParams(); // O ID aqui é o do registro do Balaústre no BD
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getBalaustre(id)
      .then((response) => {
        // --- CORREÇÃO APLICADA AQUI ---
        // Extrai os dados do formulário e as contagens da resposta da API
        const { dadosFormulario, presentesCount, visitantesCount } =
          response.data;

        // Combina os dados salvos com as contagens mais recentes para preencher o formulário
        const completeInitialData = {
          ...dadosFormulario,
          NumeroIrmaosQuadro: presentesCount,
          NumeroVisitantes: visitantesCount,
        };

        setInitialData(completeInitialData);
      })
      .catch((err) => {
        console.error(err);
        showErrorToast("Erro ao carregar dados do balaústre.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateBalaustre(id, formData);
      showSuccessToast("Balaústre atualizado com sucesso!");
      navigate("/sessoes"); // Volta para a lista de sessões
    } catch (error) {
      console.error(error);
      showErrorToast("Falha ao atualizar o balaústre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="table-page-container">
        <h2>A carregar dados do balaústre...</h2>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="table-page-container">
        <h2>Balaústre não encontrado.</h2>
      </div>
    );
  }

  // Ações para a barra lateral do FormPageLayout
  const ActionButtons = () => (
    <div className="actions-box">
      <h3>Ações</h3>
      <p>
        Altere os campos necessários e clique em "Salvar" para atualizar o
        documento no Google Docs и gerar um novo PDF.
      </p>
      <button
        type="submit"
        form="balaustre-edit-form" // O ID do formulário
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "A salvar..." : "Salvar e Regenerar Documentos"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/sessoes")}
        className="btn btn-secondary"
      >
        Voltar para Sessões
      </button>
    </div>
  );

  return (
    <FormPageLayout
      title="Editar Balaústre"
      actionsComponent={<ActionButtons />}
    >
      <BalaustreForm
        // Passamos o ID para o formulário para que o botão de submit funcione
        formId="balaustre-edit-form"
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => navigate("/sessoes")}
        isSubmitting={isSubmitting}
      />
    </FormPageLayout>
  );
};

export default BalaustreEditPage;
