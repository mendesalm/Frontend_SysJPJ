import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  sessionValidationSchema,
  TIPOS_SESSAO,
  SUBTIPOS_SESSAO,
} from "~/validators/sessionValidator";
import { formatDateForInput } from "~/utils/dateUtils";
import "~/assets/styles/FormStyles.css";

const SessionForm = ({ sessionToEdit, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(sessionValidationSchema),
  });

  useEffect(() => {
    if (sessionToEdit) {
      reset({
        ...sessionToEdit,
        dataSessao: formatDateForInput(sessionToEdit.dataSessao),
      });
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(19, 30, 0, 0);
      reset({
        dataSessao: formatDateForInput(defaultDate),
        tipoSessao: TIPOS_SESSAO[0],
        subtipoSessao: SUBTIPOS_SESSAO[0],
        status: "Agendada",
      });
    }
  }, [sessionToEdit, reset]);

  const handleFormSubmit = (data) => {
    const formData = new FormData();

    // CORREÇÃO FINAL: Envia a string de data/hora local diretamente, sem NENHUMA conversão.
    // O backend espera receber "YYYY-MM-DDTHH:mm" e irá tratar do fuso horário.
    formData.append("dataSessao", data.dataSessao);

    formData.append("tipoSessao", data.tipoSessao);
    formData.append("subtipoSessao", data.subtipoSessao);
    if (data.status) formData.append("status", data.status);

    if (data.ataSessao && data.ataSessao[0]) {
      formData.append("ataSessao", data.ataSessao[0]);
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="dataSessao">Data e Hora da Sessão</label>
        <input
          id="dataSessao"
          type="datetime-local"
          {...register("dataSessao")}
          className={`form-input ${errors.dataSessao ? "is-invalid" : ""}`}
        />
        {errors.dataSessao && (
          <p className="form-error-message">{errors.dataSessao.message}</p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="tipoSessao">Tipo da Sessão</label>
          <select
            id="tipoSessao"
            {...register("tipoSessao")}
            className={`form-select ${errors.tipoSessao ? "is-invalid" : ""}`}
          >
            {TIPOS_SESSAO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipoSessao && (
            <p className="form-error-message">{errors.tipoSessao.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="subtipoSessao">Subtipo da Sessão</label>
          <select
            id="subtipoSessao"
            {...register("subtipoSessao")}
            className={`form-select ${
              errors.subtipoSessao ? "is-invalid" : ""
            }`}
          >
            {SUBTIPOS_SESSAO.map((subtipo) => (
              <option key={subtipo} value={subtipo}>
                {subtipo}
              </option>
            ))}
          </select>
          {errors.subtipoSessao && (
            <p className="form-error-message">{errors.subtipoSessao.message}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="ataSessao">Ata da Sessão (PDF, opcional)</label>
        <input
          id="ataSessao"
          type="file"
          accept=".pdf"
          {...register("ataSessao")}
          className={`form-input ${errors.ataSessao ? "is-invalid" : ""}`}
        />
        {errors.ataSessao && (
          <p className="form-error-message">{errors.ataSessao.message}</p>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "A guardar..." : "Guardar Sessão"}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
