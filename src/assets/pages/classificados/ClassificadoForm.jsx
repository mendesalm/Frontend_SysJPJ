// src/assets/pages/classificados/ClassificadoForm.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { classificadoValidationSchema } from "../../validators/classificadosValidator";
import "../../assets/styles/FormStyles.css";

const TIPOS_ANUNCIO = ["Venda", "Compra", "Aluguel", "Doação", "Serviço"];

const ClassificadoForm = ({ anuncioToEdit, onSave, onCancel }) => {
  const isEditing = !!anuncioToEdit;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(classificadoValidationSchema),
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const fotosField = watch("fotos");

  useEffect(() => {
    if (fotosField && fotosField.length > 0) {
      const newPreviews = Array.from(fotosField).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(newPreviews);
      return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
    }
    setImagePreviews([]);
  }, [fotosField]);

  useEffect(() => {
    if (isEditing) {
      reset(anuncioToEdit);
    } else {
      reset({
        titulo: "",
        descricao: "",
        tipoAnuncio: "Venda",
        valor: "",
        contato: "",
        fotos: null,
      });
    }
  }, [anuncioToEdit, reset, isEditing]);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "fotos") {
        if (data.fotos) {
          Array.from(data.fotos).forEach((file) => {
            formData.append("fotos", file);
          });
        }
      } else {
        formData.append(key, data[key]);
      }
    });
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="titulo">Título do Anúncio</label>
        <input
          id="titulo"
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
          <label htmlFor="tipoAnuncio">Tipo de Anúncio</label>
          <select
            id="tipoAnuncio"
            {...register("tipoAnuncio")}
            className={`form-select ${errors.tipoAnuncio ? "is-invalid" : ""}`}
          >
            {TIPOS_ANUNCIO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipoAnuncio && (
            <p className="form-error-message">{errors.tipoAnuncio.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="valor">Valor (R$) (Opcional)</label>
          <input
            id="valor"
            type="number"
            step="0.01"
            {...register("valor")}
            className={`form-input ${errors.valor ? "is-invalid" : ""}`}
          />
          {errors.valor && (
            <p className="form-error-message">{errors.valor.message}</p>
          )}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="contato">Informações de Contato (Opcional)</label>
        <input
          id="contato"
          {...register("contato")}
          className={`form-input ${errors.contato ? "is-invalid" : ""}`}
        />
        {errors.contato && (
          <p className="form-error-message">{errors.contato.message}</p>
        )}
      </div>
      {!isEditing && (
        <div className="form-group">
          <label htmlFor="fotos">Fotos (até 5)</label>
          <input
            id="fotos"
            type="file"
            multiple
            accept="image/*"
            {...register("fotos")}
            className={`form-input ${errors.fotos ? "is-invalid" : ""}`}
          />
          {errors.fotos && (
            <p className="form-error-message">{errors.fotos.message}</p>
          )}
          <div className="image-previews">
            {imagePreviews.map((src, index) => (
              <img key={index} src={src} alt={`Preview ${index + 1}`} />
            ))}
          </div>
        </div>
      )}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "A guardar..."
            : isEditing
            ? "Atualizar Anúncio"
            : "Publicar Anúncio"}
        </button>
      </div>
    </form>
  );
};

export default ClassificadoForm;
