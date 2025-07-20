import React, { useEffect, useState } from "react";
import BalaustreForm from "../../../sessions/BalaustreForm.jsx";
import FormPageLayout from "../../../../../components/layout/FormPageLayout.jsx";
import { useAuth } from "../../../../../context/AuthContext.jsx";
import {
  getBalaustre,
  updateBalaustre,
  assinarBalaustre,
} from "../../../../../services/balaustreService.js";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications.js";

const BalaustreEditor = ({ balaustreId, refetchSession }) => {
  const { user } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [balaustreDetails, setBalaustreDetails] = useState(null); // New state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!balaustreId) {
      setIsLoading(false); // Para de carregar se não houver ID
      return;
    }

    setIsLoading(true);
    getBalaustre(balaustreId)
      .then((response) => {
        const { dadosFormulario, presentesCount, visitantesCount } = response;
        const completeInitialData = {
          ...dadosFormulario,
          NumeroIrmaosQuadro: presentesCount,
          NumeroVisitantes: visitantesCount,
        };
        setInitialData(completeInitialData);
        setBalaustreDetails(response); // Store the full response here
      })
      .catch((err) => {
        console.error("[BalaustreEditor] ERRO AO BUSCAR DADOS:", err);
        showErrorToast("Erro ao carregar dados do balaústre.");
      })
      .finally(() => {
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

  const handleSign = async () => {
    setIsSubmitting(true);
    try {
      await assinarBalaustre(balaustreId);
      showSuccessToast("Balaústre assinado com sucesso!");
      // Re-fetch data to update status and signatures
      const updatedResponse = await getBalaustre(balaustreId);
      const { dadosFormulario, presentesCount, visitantesCount } = updatedResponse;
      const completeInitialData = {
        ...dadosFormulario,
        NumeroIrmaosQuadro: presentesCount,
        NumeroVisitantes: visitantesCount,
      };
      setInitialData(completeInitialData);
      setBalaustreDetails(updatedResponse);
      refetchSession(); // Call refetchSession to update parent component
    } catch (error) {
      console.error(error);
      showErrorToast("Falha ao assinar o balaústre.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
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

  const isSigned = balaustreDetails?.status === "Assinado";
  const userRoles = user?.roles || [];
  const canUserOverride = userRoles.includes("Venerável Mestre") || userRoles.includes("Webmaster");

  // Check if the current user has already signed for any of their roles
  const hasUserSigned = balaustreDetails?.assinaturas?.some(signature =>
    userRoles.some(role => signature.role === role && signature.signer === user.NomeCompleto)
  );

  // Determine if the sign button should be visible and enabled
  const canSign = user?.permissions?.includes("assinarDocumentos") && !isSigned && !hasUserSigned;

  // Determine if the save button should be enabled
  const canEdit = !isSigned || canUserOverride;

  const ActionButtons = () => (
    <div className="actions-box">
      <h3>Ações do Balaústre</h3>
      <p>
        Altere os campos e clique em &quot;Salvar&quot; para atualizar o documento e gerar
        um novo PDF.
      </p>
      {!canEdit && (
        <p className="text-danger">
          Este balaústre está assinado e não pode ser editado, a menos que você seja um Venerável Mestre ou Webmaster.
        </p>
      )}
      <button
        type="submit"
        form="balaustre-edit-form"
        className="btn btn-primary"
        disabled={isSubmitting || !canEdit}
      >
        {isSubmitting ? "A salvar..." : "Salvar Balaústre"}
      </button>
      {canSign && (
        <button
          type="button"
          className="btn btn-success mt-2"
          onClick={handleSign}
          disabled={isSubmitting}
        >
          {isSubmitting ? "A assinar..." : "Assinar Balaústre"}
        </button>
      )}
      {isSigned && (
        <p className="text-success mt-2">
          Balaústre assinado. Visualizar PDF para detalhes da assinatura.
        </p>
      )}
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
        readOnly={!canEdit} // Pass readOnly prop
      />
    </FormPageLayout>
  );
};

export default BalaustreEditor;
