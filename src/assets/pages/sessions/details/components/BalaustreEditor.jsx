import React, { useEffect, useState } from "react";
import BalaustreForm from "../../../sessions/BalaustreForm.jsx";
import FormPageLayout from "../../../../../components/layout/FormPageLayout.jsx";
import {
  getBalaustre,
  updateBalaustre,
} from "../../../../../services/balaustreService.js";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications.js";

const BalaustreEditor = ({ balaustreId }) => {
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(
    `[BalaustreEditor] Componente renderizado. ID recebido via prop: ${balaustreId}`
  );

  useEffect(() => {
    console.log("[BalaustreEditor] useEffect disparado.", { balaustreId });

    if (!balaustreId) {
      console.log(
        "[BalaustreEditor] Efeito abortado: ID do balaústre é nulo ou indefinido."
      );
      setIsLoading(false); // Para de carregar se não houver ID
      return;
    }

    setIsLoading(true);
    console.log(
      `[BalaustreEditor] Iniciando busca para o balaústre ID: ${balaustreId}`
    );

    getBalaustre(balaustreId)
      .then((response) => {
        console.log(
          "[BalaustreEditor] DADOS DO BALAÚSTRE RECEBIDOS:",
          response.data
        );
        const { dadosFormulario, presentesCount, visitantesCount } =
          response.data;
        const completeInitialData = {
          ...dadosFormulario,
          NumeroIrmaosQuadro: presentesCount,
          NumeroVisitantes: visitantesCount,
        };
        setInitialData(completeInitialData);
      })
      .catch((err) => {
        console.error("[BalaustreEditor] ERRO AO BUSCAR DADOS:", err);
        showErrorToast("Erro ao carregar dados do balaústre.");
      })
      .finally(() => {
        console.log(
          "[BalaustreEditor] Busca finalizada. isLoading será definido como false."
        );
        setIsLoading(false);
      });
  }, [balaustreId]);

  const handleSave = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateBalaustre(balaustreId, formData);
      showSuccessToast("Balaústre atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      showErrorToast("Falha ao atualizar o balaústre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(
    `[BalaustreEditor] Renderizando com os estados: isLoading=${isLoading}, initialData=${JSON.stringify(
      initialData
    )}`
  );

  if (!balaustreId) {
    return (
      <div className="card">
        <h3>Balaústre</h3>
        <p>Esta sessão não possui um balaústre que possa ser editado.</p>
      </div>
    );
  }

  if (isLoading) {
    return <h2>A carregar editor do balaústre...</h2>;
  }

  if (!initialData) {
    return (
      <h2>Erro ao carregar os dados do Balaústre. Verifique o console.</h2>
    );
  }

  const ActionButtons = () => (
    <div className="actions-box">
      <h3>Ações do Balaústre</h3>
      <p>
        Altere os campos e clique em "Salvar" para atualizar o documento e gerar
        um novo PDF.
      </p>
      <button
        type="submit"
        form="balaustre-edit-form"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "A salvar..." : "Salvar Balaústre"}
      </button>
    </div>
  );

  return (
    <FormPageLayout
      title="Editor de Balaústre"
      actionsComponent={<ActionButtons />}
    >
      <BalaustreForm
        formId="balaustre-edit-form"
        initialData={initialData}
        onSave={handleSave}
        onCancel={() => {}}
        isSubmitting={isSubmitting}
      />
    </FormPageLayout>
  );
};

export default BalaustreEditor;
