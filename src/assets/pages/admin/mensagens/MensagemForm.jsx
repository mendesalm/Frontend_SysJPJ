import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  mensagemValidationSchema,
  TIPOS_MENSAGEM,
  SUBTIPOS_MENSAGEM,
} from "../../../../validators/mensagemValidator";
import "../../../../assets/styles/FormStyles.css";

const MensagemForm = ({ mensagemToEdit, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(mensagemValidationSchema),
  });

  useEffect(() => {
    if (mensagemToEdit) {
      reset(mensagemToEdit);
    } else {
      reset({
        tipo: TIPOS_MENSAGEM[0],
        subtipo: SUBTIPOS_MENSAGEM[0],
        conteudo: "",
        ativo: true,
      });
    }
  }, [mensagemToEdit, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="tipo">Tipo da Mensagem</label>
          <select
            id="tipo"
            {...register("tipo")}
            className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
          >
            {TIPOS_MENSAGEM.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <p className="form-error-message">{errors.tipo.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="subtipo">Público-Alvo</label>
          <select
            id="subtipo"
            {...register("subtipo")}
            className={`form-select ${errors.subtipo ? "is-invalid" : ""}`}
          >
            {SUBTIPOS_MENSAGEM.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.subtipo && (
            <p className="form-error-message">{errors.subtipo.message}</p>
          )}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="conteudo">Conteúdo (Pode usar tags HTML)</label>
        <textarea
          id="conteudo"
          rows="8"
          {...register("conteudo")}
          className={`form-textarea ${errors.conteudo ? "is-invalid" : ""}`}
        />
        {errors.conteudo && (
          <p className="form-error-message">{errors.conteudo.message}</p>
        )}
      </div>
      <div className="form-group-inline">
        <input id="ativo" type="checkbox" {...register("ativo")} />
        <label htmlFor="ativo">Mensagem Ativa</label>
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
          {isSubmitting ? "A guardar..." : "Guardar Mensagem"}
        </button>
      </div>
    </form>
  );
};

export default MensagemForm;
