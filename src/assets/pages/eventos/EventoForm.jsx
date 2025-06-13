import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventoValidationSchema } from "../../../validators/eventoValidator.js";
import "../../styles/FormStyles.css";

const EventoForm = ({ eventoToEdit, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(eventoValidationSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      local: "",
      tipo: "Público",
      dataHoraInicio: "",
      dataHoraFim: "",
    },
  });

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Ajusta para o fuso horário local antes de formatar para evitar erros de um dia
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (eventoToEdit) {
      reset({
        ...eventoToEdit,
        dataHoraInicio: formatDateTimeForInput(eventoToEdit.dataHoraInicio),
        dataHoraFim: formatDateTimeForInput(eventoToEdit.dataHoraFim),
      });
    } else {
      reset(); // Limpa para um novo evento
    }
  }, [eventoToEdit, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="titulo">Título do Evento</label>
        <input
          id="titulo"
          type="text"
          {...register("titulo")}
          className={`form-input ${errors.titulo ? "is-invalid" : ""}`}
        />
        {errors.titulo && (
          <p className="form-error-message">{errors.titulo.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          rows="4"
          {...register("descricao")}
          className={`form-textarea ${errors.descricao ? "is-invalid" : ""}`}
        />
        {errors.descricao && (
          <p className="form-error-message">{errors.descricao.message}</p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="local">Local</label>
          <input
            id="local"
            type="text"
            {...register("local")}
            className={`form-input ${errors.local ? "is-invalid" : ""}`}
          />
          {errors.local && (
            <p className="form-error-message">{errors.local.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Evento</label>
          <select
            id="tipo"
            {...register("tipo")}
            className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
          >
            <option value="Sessão Maçônica">Sessão Maçônica</option>
            <option value="Evento Social">Evento Social</option>
            <option value="Evento Filantrópico">Evento Filantrópico</option>
            <option value="Outro">Outro</option>
          </select>
          {errors.tipo && (
            <p className="form-error-message">{errors.tipo.message}</p>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="dataHoraInicio">Início do Evento</label>
          <input
            id="dataHoraInicio"
            type="datetime-local"
            {...register("dataHoraInicio")}
            className={`form-input ${
              errors.dataHoraInicio ? "is-invalid" : ""
            }`}
          />
          {errors.dataHoraInicio && (
            <p className="form-error-message">
              {errors.dataHoraInicio.message}
            </p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="dataHoraFim">Fim do Evento (opcional)</label>
          <input
            id="dataHoraFim"
            type="datetime-local"
            {...register("dataHoraFim")}
            className={`form-input ${errors.dataHoraFim ? "is-invalid" : ""}`}
          />
          {errors.dataHoraFim && (
            <p className="form-error-message">{errors.dataHoraFim.message}</p>
          )}
        </div>
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
          {isSubmitting ? "A salvar..." : "Salvar Evento"}
        </button>
      </div>
    </form>
  );
};

export default EventoForm;
