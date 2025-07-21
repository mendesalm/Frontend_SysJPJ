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
        tipoResponsabilidadeJantar: sessionToEdit.tipoResponsabilidadeJantar || 'Sequencial',
        enviarEmails: false, // Adicionar o campo para edição, padrão false
      });
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(19, 30, 0, 0);
      reset({
        dataSessao: formatDateForInput(defaultDate),
        tipoSessao: TIPOS_SESSAO[0],
        subtipoSessao: SUBTIPOS_SESSAO[0],
        status: "Agendada",
        tipoResponsabilidadeJantar: 'Sequencial',
        enviarEmails: false, // Padrão para nova sessão
      });
    }
  }, [sessionToEdit, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
        dataSessao: data.dataSessao,
        tipoSessao: data.tipoSessao,
        subtipoSessao: data.subtipoSessao,
        status: data.status,
        tipoResponsabilidadeJantar: data.tipoResponsabilidadeJantar,
        enviarEmails: data.enviarEmails, // Incluir o valor do checkbox
    };

    onSave(payload);
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
          <label htmlFor="tipoResponsabilidadeJantar">Responsabilidade pelo Jantar</label>
          <select
            id="tipoResponsabilidadeJantar"
            {...register("tipoResponsabilidadeJantar")}
            className={`form-select ${errors.tipoResponsabilidadeJantar ? "is-invalid" : ""}`}
          >
            <option value="Sequencial">Seguir a Escala</option>
            <option value="Institucional">Jantar Institucional</option>
            <option value="Especial">Jantar Especial</option>
          </select>
          {errors.tipoResponsabilidadeJantar && (
            <p className="form-error-message">{errors.tipoResponsabilidadeJantar.message}</p>
          )}
        </div>

      {/* Novo checkbox para envio de emails */}
      <div className="form-group form-check-group">
        <input
          type="checkbox"
          id="enviarEmails"
          {...register("enviarEmails")}
          className="form-check-input"
        />
        <label htmlFor="enviarEmails" className="form-check-label">
          Enviar Edital e Convite por Email
        </label>
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

