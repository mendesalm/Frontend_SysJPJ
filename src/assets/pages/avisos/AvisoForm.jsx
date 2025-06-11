import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { avisoValidationSchema } from "../../../validators/avisoValidator.js";
import "../../styles/FormStyles.css";

const AvisoForm = ({ avisoToEdit, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(avisoValidationSchema),
    defaultValues: {
      titulo: "",
      conteudo: "",
      fixado: false,
      dataExpiracao: "",
    },
  });

  useEffect(() => {
    if (avisoToEdit) {
      reset({
        titulo: avisoToEdit.titulo || "",
        conteudo: avisoToEdit.conteudo || "",
        fixado: avisoToEdit.fixado || false,
        dataExpiracao: avisoToEdit.dataExpiracao
          ? new Date(avisoToEdit.dataExpiracao).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset(); // Limpa o formulário para um novo aviso
    }
  }, [avisoToEdit, reset]);

  const onSubmit = (data) => {
    // A função onSave agora recebe os dados já validados
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="titulo">Título</label>
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
        <label htmlFor="conteudo">Conteúdo</label>
        <textarea
          id="conteudo"
          rows="5"
          {...register("conteudo")}
          className={`form-textarea ${errors.conteudo ? "is-invalid" : ""}`}
        />
        {errors.conteudo && (
          <p className="form-error-message">{errors.conteudo.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="dataExpiracao">Data de Expiração (opcional)</label>
        <input
          id="dataExpiracao"
          type="date"
          {...register("dataExpiracao")}
          className={`form-input ${errors.dataExpiracao ? "is-invalid" : ""}`}
        />
        {errors.dataExpiracao && (
          <p className="form-error-message">{errors.dataExpiracao.message}</p>
        )}
      </div>

      <div className="form-group-inline">
        <input id="fixado" type="checkbox" {...register("fixado")} />
        <label htmlFor="fixado">Fixar este aviso no topo</label>
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
          {isSubmitting ? "A salvar..." : "Salvar Aviso"}
        </button>
      </div>
    </form>
  );
};

export default AvisoForm;
