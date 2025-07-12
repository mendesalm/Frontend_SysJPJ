// src/assets/pages/admin/lojas/LojaForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { lojaValidationSchema } from "../../../../validators/lojaValidator";
import "../../../styles/FormStyles.css";

const LojaForm = ({ lojaToEdit, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(lojaValidationSchema),
  });

  useEffect(() => {
    if (lojaToEdit) {
      reset(lojaToEdit);
    } else {
      reset({ nome: "", numero: "", cidade: "", estado: "", potencia: "" });
    }
  }, [lojaToEdit, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <div className="form-group">
        <label htmlFor="nome">Nome da Loja</label>
        <input
          id="nome"
          type="text"
          {...register("nome")}
          className={`form-input ${errors.nome ? "is-invalid" : ""}`}
        />
        {errors.nome && (
          <p className="form-error-message">{errors.nome.message}</p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="numero">Número (Opcional)</label>
          <input
            id="numero"
            type="number"
            {...register("numero")}
            className={`form-input ${errors.numero ? "is-invalid" : ""}`}
          />
          {errors.numero && (
            <p className="form-error-message">{errors.numero.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="potencia">Potência</label>
          <input
            id="potencia"
            type="text"
            {...register("potencia")}
            className={`form-input ${errors.potencia ? "is-invalid" : ""}`}
          />
          {errors.potencia && (
            <p className="form-error-message">{errors.potencia.message}</p>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="cidade">Cidade</label>
          <input
            id="cidade"
            type="text"
            {...register("cidade")}
            className={`form-input ${errors.cidade ? "is-invalid" : ""}`}
          />
          {errors.cidade && (
            <p className="form-error-message">{errors.cidade.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="estado">Estado (UF)</label>
          <input
            id="estado"
            type="text"
            {...register("estado")}
            className={`form-input ${errors.estado ? "is-invalid" : ""}`}
          />
          {errors.estado && (
            <p className="form-error-message">{errors.estado.message}</p>
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
          {isSubmitting ? "A salvar..." : "Salvar Loja"}
        </button>
      </div>
    </form>
  );
};

export default LojaForm;
