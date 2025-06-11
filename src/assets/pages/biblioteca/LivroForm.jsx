import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { livroValidationSchema } from "../../../validators/livroValidator.js";
import "../../styles/FormStyles.css";

const LivroForm = ({ livroToEdit, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(livroValidationSchema),
    defaultValues: {
      titulo: "",
      autores: "",
      editora: "",
      anoPublicacao: "",
      ISBN: "",
      numeroPaginas: "",
      classificacao: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    if (livroToEdit) {
      reset(livroToEdit);
    } else {
      reset(); // Limpa o formulário para um novo livro
    }
  }, [livroToEdit, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-grid">
        <div className="form-group full-width">
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
          <label htmlFor="autores">Autor(es)</label>
          <input
            id="autores"
            type="text"
            {...register("autores")}
            className={`form-input ${errors.autores ? "is-invalid" : ""}`}
          />
          {errors.autores && (
            <p className="form-error-message">{errors.autores.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="editora">Editora</label>
          <input
            id="editora"
            type="text"
            {...register("editora")}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="anoPublicacao">Ano de Publicação</label>
          <input
            id="anoPublicacao"
            type="number"
            {...register("anoPublicacao")}
            className={`form-input ${errors.anoPublicacao ? "is-invalid" : ""}`}
          />
          {errors.anoPublicacao && (
            <p className="form-error-message">{errors.anoPublicacao.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="numeroPaginas">Nº de Páginas</label>
          <input
            id="numeroPaginas"
            type="number"
            {...register("numeroPaginas")}
            className={`form-input ${errors.numeroPaginas ? "is-invalid" : ""}`}
          />
          {errors.numeroPaginas && (
            <p className="form-error-message">{errors.numeroPaginas.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ISBN">ISBN</label>
          <input
            id="ISBN"
            type="text"
            {...register("ISBN")}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="classificacao">Classificação/Localização</label>
        <input
          id="classificacao"
          type="text"
          {...register("classificacao")}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          id="observacoes"
          rows="3"
          {...register("observacoes")}
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
          {isSubmitting ? "A salvar..." : "Salvar Livro"}
        </button>
      </div>
    </form>
  );
};

export default LivroForm;
