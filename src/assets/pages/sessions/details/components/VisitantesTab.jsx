import React, { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDataFetching } from "../../../../../hooks/useDataFetching";
import apiClient from "../../../../../services/apiClient";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications";

const GRADUACAO_OPTIONS = [
  "Aprendiz",
  "Companheiro",
  "Mestre",
  "Mestre Instalado",
];

// Objeto com os valores padrão para uma nova linha de visitante
const defaultVisitorRow = {
  graduacao: "Mestre",
  nomeCompleto: "",
  cim: "",
  loja: "",
  oriente: "",
  potencia: "",
};

const VisitantesTab = ({ sessionId }) => {
  const fetchVisitors = useCallback(() => {
    return apiClient.get(`/sessions/${sessionId}/visitors`);
  }, [sessionId]);

  const {
    data: visitantes = [],
    isLoading,
    refetch,
  } = useDataFetching(fetchVisitors);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      newVisitors: [defaultVisitorRow], // Inicia com uma linha vazia
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "newVisitors",
  });

  const [isSaving, setIsSaving] = useState(false);

  const onSaveAll = async (data) => {
    setIsSaving(true);
    const visitorsToCreate = data.newVisitors.filter(
      (v) => v.nomeCompleto.trim() !== ""
    );

    if (visitorsToCreate.length === 0) {
      showErrorToast("Nenhum visitante para adicionar.");
      setIsSaving(false);
      return;
    }

    const savePromises = visitorsToCreate.map((visitor) =>
      apiClient.post(`/sessions/${sessionId}/visitors`, visitor)
    );

    try {
      await Promise.all(savePromises);
      showSuccessToast(
        `${visitorsToCreate.length} visitante(s) adicionado(s) com sucesso!`
      );
      reset({ newVisitors: [defaultVisitorRow] }); // Limpa o formulário
      refetch();
    } catch (error) {
      showErrorToast("Ocorreu um erro ao salvar um ou mais visitantes.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVisitor = async (visitorId) => {
    if (!window.confirm("Tem certeza que deseja remover este visitante?"))
      return;
    try {
      await apiClient.delete(`/sessions/${sessionId}/visitors/${visitorId}`);
      showSuccessToast("Visitante removido!");
      refetch();
    } catch (error) {
      showErrorToast("Não foi possível remover o visitante.");
      console.error(error);
    }
  };

  if (isLoading && !visitantes.length) return <p>Carregando visitantes...</p>;

  return (
    <div className="card">
      <h3>Registro de Visitantes</h3>

      <form onSubmit={handleSubmit(onSaveAll)}>
        <div className="bulk-add-container">
          <div className="visitor-row-bulk header">
            <label>Graduação</label>
            <label>Nome Completo</label>
            <label>CIM</label>
            <label>Loja de Origem</label>
            <label>Oriente</label>
            <label>Potência</label>
            <span></span>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="visitor-row-bulk">
              <select
                {...register(`newVisitors.${index}.graduacao`)}
                className="form-select"
              >
                {GRADUACAO_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <input
                {...register(`newVisitors.${index}.nomeCompleto`)}
                placeholder="Nome do Irmão"
                className="form-input"
              />
              <input
                {...register(`newVisitors.${index}.cim`)}
                placeholder="Nº do CIM"
                className="form-input"
              />
              <input
                {...register(`newVisitors.${index}.loja`)}
                placeholder="Nome da Loja"
                className="form-input"
              />
              <input
                {...register(`newVisitors.${index}.oriente`)}
                placeholder="Cidade da Loja"
                className="form-input"
              />
              <input
                {...register(`newVisitors.${index}.potencia`)}
                placeholder="Potência"
                className="form-input"
              />
              <button
                type="button"
                className="btn-action btn-delete"
                onClick={() => remove(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <div className="bulk-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => append(defaultVisitorRow)}
          >
            + Adicionar Visitante
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? "Salvando..." : `Salvar Visitante(s)`}
          </button>
        </div>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h4>Visitantes Registrados ({visitantes.length})</h4>
      <ul className="lista-simples">
        {visitantes.length > 0 ? (
          visitantes.map((v) => (
            <li key={v.id}>
              <div className="visitor-info">
                <span className="nome">
                  <strong>{v.nomeCompleto}</strong> - {v.graduacao} (CIM:{" "}
                  {v.cim || "N/A"})
                </span>
                <span className="loja">
                  Loja: {v.loja || "Não informada"} | Oriente:{" "}
                  {v.oriente || "Não informado"} | Potência:{" "}
                  {v.potencia || "Não informada"}
                </span>
              </div>
              <button
                className="btn-action btn-delete"
                onClick={() => handleDeleteVisitor(v.id)}
              >
                Remover
              </button>
            </li>
          ))
        ) : (
          <p>Nenhum visitante registrado para esta sessão.</p>
        )}
      </ul>
    </div>
  );
};

export default VisitantesTab;
