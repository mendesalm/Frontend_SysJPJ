// src/assets/pages/admin/members/components/PersonalDataFields.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../../../../../services/apiClient";
import PlaceholderAvatar from "../../../../images/avatar_placeholder.png";
import CondecoracoesFields from './CondecoracoesFields';

const PersonalDataFields = ({ register, errors, watch, initialPhoto, control }) => {
  const [preview, setPreview] = useState(null);
  const photoFile = watch("FotoPessoal");

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [photoFile]);

  const getFileUrl = (path) => {
    if (!path) return PlaceholderAvatar;
    const baseURL = apiClient.defaults.baseURL.startsWith("http")
      ? apiClient.defaults.baseURL
      : window.location.origin;
    return `${baseURL}/${path}`.replace("/api/", "/");
  };

  const currentImage =
    preview || (initialPhoto ? getFileUrl(initialPhoto) : PlaceholderAvatar);

  return (
    <fieldset className="form-fieldset">
      <legend>Dados Pessoais</legend>
      <div className="personal-data-container">
        <div className="photo-column">
          <img
            src={currentImage}
            alt="Foto do Membro"
            className="profile-photo-preview"
          />
          <details className="photo-actions-dropdown">
            <summary>Alterar Foto</summary>
            <div className="form-group">
              <label htmlFor="FotoPessoal">Selecione uma nova foto</label>
              <input
                type="file"
                id="FotoPessoal"
                {...register("FotoPessoal")}
                className="form-input"
                accept="image/jpeg, image/png, image/gif, image/webp"
              />
              {errors.FotoPessoal && (
                <p className="form-error-message">
                  {errors.FotoPessoal.message}
                </p>
              )}
            </div>
          </details>
        </div>

        <div className="fields-column">
          {/* ATUALIZADO: Nome Completo em sua própria grelha para garantir que ocupe a linha inteira */}
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Nome Completo</label>
              <input
                type="text"
                {...register("NomeCompleto")}
                className={`form-input ${
                  errors.NomeCompleto ? "is-invalid" : ""
                }`}
              />
              {errors.NomeCompleto && (
                <p className="form-error-message">
                  {errors.NomeCompleto.message}
                </p>
              )}
            </div>
          </div>
          {/* ATUALIZADO: Restantes campos agrupados na sua própria grelha */}
          <div className="form-grid personal-fields-grid">
            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                {...register("CPF")}
                className={`form-input ${errors.CPF ? "is-invalid" : ""}`}
              />
              {errors.CPF && (
                <p className="form-error-message">{errors.CPF.message}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...register("Email")}
                className={`form-input ${errors.Email ? "is-invalid" : ""}`}
              />
              {errors.Email && (
                <p className="form-error-message">{errors.Email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label>Identidade (RG)</label>
              <input
                type="text"
                {...register("Identidade")}
                className={`form-input ${
                  errors.Identidade ? "is-invalid" : ""
                }`}
              />
              {errors.Identidade && (
                <p className="form-error-message">
                  {errors.Identidade.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                {...register("DataNascimento")}
                className={`form-input ${
                  errors.DataNascimento ? "is-invalid" : ""
                }`}
              />
              {errors.DataNascimento && (
                <p className="form-error-message">
                  {errors.DataNascimento.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Data de Casamento</label>
              <input
                type="date"
                {...register("DataCasamento")}
                className={`form-input ${
                  errors.DataCasamento ? "is-invalid" : ""
                }`}
              />
              {errors.DataCasamento && (
                <p className="form-error-message">
                  {errors.DataCasamento.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                {...register("Telefone")}
                className={`form-input ${errors.Telefone ? "is-invalid" : ""}`}
              />
              {errors.Telefone && (
                <p className="form-error-message">{errors.Telefone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <CondecoracoesFields control={control} register={register} errors={errors} />
    </fieldset>
  );
};

export default PersonalDataFields;
