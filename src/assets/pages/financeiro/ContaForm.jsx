import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contaValidationSchema } from "../../../validators/financeiroValidator.js";
import "../../styles/FormStyles.css";

const ContaForm = ({ contaToEdit, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(contaValidationSchema),
    defaultValues: {
      nome: "",
      tipo: "Despesa",
      descricao: "",
    },
  });

  useEffect(() => {
    if (contaToEdit) {
      reset(contaToEdit);
    } else {
      reset();
    }
  }, [contaToEdit, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="nome">Nome da Conta</label>
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

      <div className="form-group">
        <label htmlFor="tipo">Tipo de Conta</label>
        <select
          id="tipo"
          {...register("tipo")}
          className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
        >
          <option value="Despesa">Despesa</option>
          <option value="Receita">Receita</option>
        </select>
        {errors.tipo && (
          <p className="form-error-message">{errors.tipo.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Descrição (opcional)</label>
        <textarea
          id="descricao"
          rows="3"
          {...register("descricao")}
          className="form-textarea"
        />
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
          {isSubmitting ? "A salvar..." : "Salvar Conta"}
        </button>
      </div>
    </form>
  );
};

export default ContaForm;
