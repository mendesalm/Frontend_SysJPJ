import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { publicacaoValidationSchema } from "../../../validators/publicacaoValidator.js";
import "../../styles/FormStyles.css";

const PublicacaoForm = ({ onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(publicacaoValidationSchema),
  });

  // A função onSave (passada como prop) será chamada apenas se a validação for bem-sucedida.
  // Ela deve esperar um objeto FormData.
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("nome", data.nome);
    formData.append("tema", data.tema);
    formData.append("grau", data.grau);
    if (data.publicacaoFile && data.publicacaoFile[0]) {
      formData.append("arquivoPublicacao", data.publicacaoFile[0]);
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="nome">Nome do Trabalho</label>
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
          <label htmlFor="tema">Tema</label>
          <input
            id="tema"
            type="text"
            {...register("tema")}
            className={`form-input ${errors.tema ? "is-invalid" : ""}`}
          />
          {errors.tema && (
            <p className="form-error-message">{errors.tema.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="grau">Grau (opcional)</label>
          <select id="grau" {...register("grau")} className="form-select">
            <option value="">Selecione um grau</option>
            <option value="Aprendiz">Aprendiz</option>
            <option value="Companheiro">Companheiro</option>
            <option value="Mestre">Mestre</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="publicacaoFile">
          Ficheiro da Publicação (PDF, DOCX)
        </label>
        <input
          id="publicacaoFile"
          type="file"
          {...register("publicacaoFile")}
          className={`form-input ${errors.publicacaoFile ? "is-invalid" : ""}`}
        />
        {errors.publicacaoFile && (
          <p className="form-error-message">{errors.publicacaoFile.message}</p>
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
          {isSubmitting ? "A enviar..." : "Salvar Publicação"}
        </button>
      </div>
    </form>
  );
};

export default PublicacaoForm;
